'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');
const { Client } = require('minecraft-launcher-core');
const store = require('./store');

const MANIFEST_URL = 'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json';
let manifestCache = null;
let manifestCacheAt = 0;

function offlineUuid(name) {
  const hash = crypto.createHash('md5').update(`OfflinePlayer:${name}`, 'utf8').digest();
  hash[6] = (hash[6] & 0x0f) | 0x30;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function offlineAuth(name) {
  const major = 0;
  return {
    access_token: '0'.repeat(32),
    client_token: '0'.repeat(32),
    uuid: offlineUuid(name),
    name,
    user_properties: '{}',
    meta: { type: 'Legacy', demo: false, online: false },
  };
}

async function fetchJson(url, timeout = 10000) {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeout), headers: { 'User-Agent': 'EmberLauncher/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} для ${url}`);
  return res.json();
}

async function getManifest(force = false) {
  if (!force && manifestCache && Date.now() - manifestCacheAt < 15 * 60 * 1000) return manifestCache;
  const data = await fetchJson(MANIFEST_URL, 12000);
  manifestCache = data;
  manifestCacheAt = Date.now();
  return data;
}

async function getAvailableVersions() {
  const data = await getManifest();
  return {
    latest: data.latest,
    versions: (data.versions || []).map(v => ({
      id: v.id,
      type: v.type,
      url: v.url,
      releaseTime: v.releaseTime,
      time: v.time,
    })),
  };
}

function emitProgress(onProgress, patch) {
  if (typeof onProgress === 'function') {
    try { onProgress(patch); } catch {}
  }
}

async function downloadFile(url, dest, { sha1, onProgress, label } = {}) {
  const tmp = `${dest}.part`;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, { headers: { 'User-Agent': 'EmberLauncher/1.0' } });
  if (!res.ok || !res.body) throw new Error(`Не удалось скачать ${label || url}: HTTP ${res.status}`);
  const total = Number(res.headers.get('content-length')) || 0;
  let received = 0;
  let lastEmit = 0;
  const hash = crypto.createHash('sha1');
  const stream = fs.createWriteStream(tmp);
  try {
    for await (const chunk of res.body) {
      const buf = Buffer.from(chunk);
      hash.update(buf);
      received += buf.length;
      if (!stream.write(buf)) await new Promise(r => stream.once('drain', r));
      const now = Date.now();
      if (now - lastEmit > 100) {
        lastEmit = now;
        emitProgress(onProgress, {
          downloaded: received,
          total,
          percent: total ? Math.min(99, Math.round((received / total) * 100)) : null,
          label: label || path.basename(dest),
          speed: 0,
        });
      }
    }
    await new Promise((resolve, reject) => stream.end(err => err ? reject(err) : resolve()));
  } catch (err) {
    stream.destroy();
    try { fs.unlinkSync(tmp); } catch {}
    throw err;
  }
  if (sha1) {
    const actual = hash.digest('hex');
    if (actual.toLowerCase() !== sha1.toLowerCase()) {
      try { fs.unlinkSync(tmp); } catch {}
      throw new Error(`Проверка SHA-1 не пройдена для ${label || dest}`);
    }
  }
  fs.renameSync(tmp, dest);
  emitProgress(onProgress, { downloaded: received, total: received, percent: 100, label: label || path.basename(dest) });
  return dest;
}

async function installVersion({ root, id, url, onProgress }) {
  if (!/^[0-9A-Za-z._-]+$/.test(id)) throw new Error('Некорректный идентификатор версии');
  const dir = path.join(root, 'versions', id);
  const jsonPath = path.join(dir, `${id}.json`);
  fs.mkdirSync(dir, { recursive: true });

  emitProgress(onProgress, { phase: 'meta', label: `Получение данных ${id}`, percent: 2 });
  const data = await fetchJson(url, 20000);
  if (!data.downloads?.client?.url) throw new Error('В описании версии нет клиентского файла');
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');

  const jarPath = path.join(dir, `${id}.jar`);
  emitProgress(onProgress, { phase: 'client', label: `Загрузка клиента ${id}`, percent: 8 });
  await downloadFile(data.downloads.client.url, jarPath, {
    sha1: data.downloads.client.sha1,
    label: `${id}.jar`,
    onProgress: p => {
      const mapped = p.percent == null ? null : 8 + Math.round(p.percent * 0.9);
      emitProgress(onProgress, {
        phase: 'client',
        label: p.label,
        percent: mapped,
        downloaded: p.downloaded,
        total: p.total,
      });
    },
  });

  emitProgress(onProgress, { phase: 'done', label: 'Клиент загружен', percent: 100 });
  const version = store.scanVersions(root).find(v => v.key === id) || null;
  return { version, json: data };
}

function normalizeError(err) {
  if (!err) return 'Неизвестная ошибка';
  if (typeof err === 'string') return err;
  if (err.message) return err.message;
  if (err.error) return typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
  return String(err);
}

function launchVersion({ root, config, version, java, onEvent, onLog }) {
  const launcher = new Client();
  const logName = `launch-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
  const logPath = path.join(store.getLogsDir(), logName);
  const log = fs.createWriteStream(logPath, { flags: 'a' });
  let child = null;
  let closed = false;
  let lastLogSent = 0;
  let lastLogLine = '';

  const send = payload => { if (typeof onEvent === 'function') { try { onEvent(payload); } catch {} } };
  const writeLog = line => {
    try { log.write(`[${new Date().toISOString()}] ${line}\n`); } catch {}
  };

  const auth = offlineAuth(config.nickname);
  const baseMajor = Number(String(version.base).split('.')[1] || 0);
  const isLegacy = baseMajor > 0 && baseMajor < 16;
  auth.meta.type = isLegacy ? 'Legacy' : 'msa';

  const opts = {
    authorization: auth,
    root,
    version: {
      number: version.base,
      type: version.type === 'snapshot' ? 'snapshot' : 'release',
      ...(version.custom ? { custom: version.folder } : {}),
    },
    memory: {
      min: `${Math.min(2, config.ram)}G`,
      max: `${config.ram}G`,
    },
    javaPath: java.path,
    window: {
      width: config.resolution.width,
      height: config.resolution.height,
      fullscreen: Boolean(config.fullscreen),
    },
    overrides: {
      detached: true,
      maxSockets: 8,
    },
  };

  writeLog(`Version ${version.key} (${version.base}), custom=${Boolean(version.custom)}, loader=${version.loader}`);
  writeLog(`Java ${java.version} at ${java.path}`);
  writeLog(`Memory ${config.ram}G, window ${config.resolution.width}x${config.resolution.height}`);

  launcher.on('debug', line => {
    writeLog(`[debug] ${line}`);
    const text = String(line);
    if (text.includes('Failed to download')) {
      send({ type: 'log', level: 'warn', line: text });
    }
  });

  launcher.on('progress', p => {
    if (!p || !p.type) return;
    const total = Number(p.total) || 0;
    const task = Number(p.task) || 0;
    const percent = total ? Math.min(100, Math.round((task / total) * 100)) : null;
    const stageMap = {
      classes: 'Проверка библиотек',
      assets: 'Загрузка ресурсов',
      natives: 'Распаковка библиотек',
    };
    send({
      type: 'progress',
      stage: stageMap[p.type] || 'Подготовка файлов',
      phase: p.type,
      task,
      total,
      percent,
    });
  });

  launcher.on('download', file => {
    send({ type: 'file', file: String(file) });
  });

  launcher.on('download-status', () => {});

  launcher.on('data', raw => {
    const text = String(raw ?? '');
    writeLog(`[game] ${text.trimEnd()}`);
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (line.includes('Session ID is token')) continue;
      lastLogLine = line.replace(/^\[[^\]]*\]\s*/, '');
      const now = Date.now();
      if (now - lastLogSent > 120) {
        lastLogSent = now;
        send({ type: 'log', level: 'info', line: lastLogLine });
      }
    }
    if (typeof onLog === 'function') {
      try { onLog(lines.join('\n')); } catch {}
    }
  });

  launcher.on('error', err => {
    const message = normalizeError(err);
    writeLog(`[error] ${message}`);
    send({ type: 'error', message, logPath });
  });

  launcher.on('close', code => {
    closed = true;
    writeLog(`[close] code ${code}`);
    try { log.end(); } catch {}
    send({ type: 'closed', code });
  });

  const promise = launcher.launch(opts).then(result => {
    child = result;
    if (result?.pid) {
      writeLog(`[spawn] pid ${result.pid}`);
      send({ type: 'started', pid: result.pid, logPath });
    }
    return result;
  }).catch(err => {
    const message = normalizeError(err);
    writeLog(`[launch-error] ${message}`);
    send({ type: 'error', message, logPath });
    try { log.end(); } catch {}
    throw err;
  });

  function kill() {
    if (!child || closed) return Promise.resolve(false);
    return new Promise(resolve => {
      if (process.platform === 'win32') {
        execFile('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }, () => resolve(true));
      } else {
        try { child.kill('SIGTERM'); } catch {}
        resolve(true);
      }
    });
  }

  return { launcher, promise, kill, logPath, get pid() { return child?.pid || null; } };
}

module.exports = {
  offlineUuid,
  offlineAuth,
  getManifest,
  getAvailableVersions,
  installVersion,
  launchVersion,
  downloadFile,
};
