'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const APP_DIR = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'EmberLauncher');
const CONFIG_PATH = path.join(APP_DIR, 'config.json');
const LOG_DIR = path.join(APP_DIR, 'logs');

const DEFAULT_RESOLUTION = { width: 1280, height: 720 };

function ensureDirs() {
  fs.mkdirSync(APP_DIR, { recursive: true });
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function findDefaultRoot() {
  const roaming = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  const standard = path.join(roaming, '.minecraft');
  try {
    if (fs.statSync(standard).isDirectory()) return standard;
  } catch {}
  return path.join(os.homedir(), '.minecraft');
}

function readNicknameFromRoot(root) {
  const candidates = [
    path.join(root, 'username'),
    path.join(root, 'launcher_accounts.json'),
    path.join(process.env.APPDATA || '', '.minecraft', 'username'),
  ];
  for (const file of candidates) {
    try {
      const raw = fs.readFileSync(file, 'utf8').trim();
      if (!raw) continue;
      if (file.endsWith('.json')) {
        const data = JSON.parse(raw);
        const account = data?.accounts && Object.values(data.accounts)[0];
        if (account?.minecraftProfile?.name) return account.minecraftProfile.name;
        continue;
      }
      if (/^[A-Za-z0-9_]{3,16}$/.test(raw)) return raw;
    } catch {}
  }
  return 'Steve';
}

function defaultConfig() {
  const root = findDefaultRoot();
  return {
    schema: 1,
    nickname: readNicknameFromRoot(root),
    root,
    ram: 4,
    javaPath: '',
    resolution: { ...DEFAULT_RESOLUTION },
    fullscreen: false,
    closeOnLaunch: false,
    lastVersionKey: '',
    lastVersionPlayed: '',
    lastPlayedAt: null,
    launches: 0,
    playtimeMs: 0,
    activeSessionStart: null,
    backgroundMotion: true,
    particles: true,
    createdAt: Date.now(),
  };
}

function loadConfig() {
  ensureDirs();
  try {
    const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    const merged = { ...defaultConfig(), ...raw };
    merged.resolution = { ...DEFAULT_RESOLUTION, ...(raw.resolution || {}) };
    if (!merged.root || typeof merged.root !== 'string') merged.root = findDefaultRoot();
    if (!merged.nickname || !/^[A-Za-z0-9_]{3,16}$/.test(merged.nickname)) merged.nickname = 'Steve';
    if (!Number.isFinite(merged.ram)) merged.ram = 4;
    merged.ram = Math.max(1, Math.min(32, Math.round(merged.ram)));
    return merged;
  } catch {
    const cfg = defaultConfig();
    saveConfig(cfg);
    return cfg;
  }
}

function saveConfig(config) {
  ensureDirs();
  const tmp = CONFIG_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(config, null, 2), 'utf8');
  fs.renameSync(tmp, CONFIG_PATH);
}

function updateConfig(patch) {
  const config = loadConfig();
  const next = { ...config, ...patch };
  next.resolution = { ...config.resolution, ...(patch.resolution || {}) };
  if (next.ram) next.ram = Math.max(1, Math.min(32, Math.round(Number(next.ram) || 4)));
  saveConfig(next);
  return next;
}

function safeReadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function resolveBase(root, folder, data) {
  let base = data.inheritsFrom || data.id || folder;
  const seen = new Set();
  for (let i = 0; i < 4; i++) {
    if (seen.has(base)) break;
    seen.add(base);
    const json = safeReadJson(path.join(root, 'versions', base, `${base}.json`));
    if (json && json.inheritsFrom) base = json.inheritsFrom;
    else break;
  }
  return base;
}

function detectLoader(folder, data) {
  const main = String(data.mainClass || '').toLowerCase();
  const id = `${folder} ${data.id || ''}`.toLowerCase();
  if (id.includes('neoforge')) return 'neoforge';
  if (id.includes('fabric')) return 'fabric';
  if (id.includes('quilt')) return 'quilt';
  if (id.includes('forge')) return 'forge';
  if (main.includes('fabricmc') || main.includes('fabric-loader')) return 'fabric';
  if (main.includes('quiltmc')) return 'quilt';
  if (main.includes('neoforge')) return 'neoforge';
  if (main.includes('minecraftforge') || main.includes('fmlclient') || main.includes('bootstraplauncher')) return 'forge';
  if (main === 'net.minecraft.client.main.main') return 'vanilla';
  return main ? 'custom' : 'vanilla';
}

function exists(file) {
  try { return fs.statSync(file).isFile(); } catch { return false; }
}

function scanVersions(root) {
  const versionsDir = path.join(root, 'versions');
  let entries = [];
  try {
    entries = fs.readdirSync(versionsDir, { withFileTypes: true });
  } catch {
    return [];
  }

  const result = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folder = entry.name;
    const dir = path.join(versionsDir, folder);
    let jsonPath = path.join(dir, `${folder}.json`);
    if (!exists(jsonPath)) {
      try {
        const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.json'));
        if (!files.length) continue;
        jsonPath = path.join(dir, files[0]);
      } catch { continue; }
    }
    const data = safeReadJson(jsonPath);
    if (!data || typeof data !== 'object') continue;

    const base = resolveBase(root, folder, data);
    const loader = detectLoader(folder, data);
    const jarPath = path.join(dir, `${folder}.jar`);
    const baseJar = path.join(root, 'versions', base, `${base}.jar`);
    const hasJar = exists(jarPath) || exists(baseJar);
    let releaseTime = data.releaseTime || data.time || null;
    if (!releaseTime) {
      try { releaseTime = fs.statSync(dir).mtime.toISOString(); } catch {}
    }
    let jarSize = 0;
    try { jarSize = fs.statSync(exists(jarPath) ? jarPath : baseJar).size; } catch {}

    const isVanilla = loader === 'vanilla' && base === folder && String(data.id || folder) === folder;

    result.push({
      key: folder,
      folder,
      id: data.id || folder,
      base,
      type: data.type || (isVanilla ? 'release' : 'custom'),
      loader,
      custom: !isVanilla,
      jar: hasJar,
      jarSize,
      releaseTime,
      javaMajor: data.javaVersion?.majorVersion || null,
      missingBase: loader !== 'vanilla' && !exists(baseJar),
    });
  }

  result.sort((a, b) => {
    const ta = new Date(a.releaseTime || 0).getTime();
    const tb = new Date(b.releaseTime || 0).getTime();
    if (tb !== ta) return tb - ta;
    return a.id.localeCompare(b.id, 'ru');
  });
  return result;
}

function countWorlds(root) {
  try {
    return fs.readdirSync(path.join(root, 'saves'), { withFileTypes: true })
      .filter(e => e.isDirectory()).length;
  } catch {
    return 0;
  }
}

function scanMods(root) {
  const modsDir = path.join(root, 'mods');
  let files = [];
  try {
    files = fs.readdirSync(modsDir, { withFileTypes: true });
  } catch {
    return [];
  }
  const mods = [];
  for (const f of files) {
    if (!f.isFile()) continue;
    const lower = f.name.toLowerCase();
    let enabled = false;
    let fileName = f.name;
    if (lower.endsWith('.jar')) enabled = true;
    else if (lower.endsWith('.jar.disabled')) {
      enabled = false;
      fileName = f.name.slice(0, -'.disabled'.length);
    } else continue;
    // Ignore obvious non-mod jars
    if (lower.startsWith('.')) continue;
    let size = 0;
    let mtime = null;
    try {
      const st = fs.statSync(path.join(modsDir, f.name));
      size = st.size;
      mtime = st.mtime.toISOString();
    } catch {}
    mods.push({
      file: f.name,
      name: prettyModName(fileName),
      filename: fileName,
      enabled,
      size,
      mtime,
    });
  }
  mods.sort((a, b) => {
    if (a.enabled !== b.enabled) return a.enabled ? -1 : 1;
    return a.name.localeCompare(b.name, 'ru');
  });
  return mods;
}

function prettyModName(filename) {
  let name = filename.replace(/\.jar$/i, '');
  name = name.replace(/\.(disabled)$/i, '');
  // strip common version suffixes and loader tags
  name = name.replace(/(?:[-_+.](?:v?\d+(?:\.\d+)*(?:[-+][A-Za-z0-9._-]+)?))(?:[-_+](?:fabric|forge|neoforge|quilt|mc)?[A-Za-z0-9._-]*)?$/i, '');
  name = name.replace(/[-_](?:fabric|forge|neoforge|quilt|mc)[-_]?[0-9].*$/i, '');
  name = name.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!name) name = filename.replace(/\.jar$/i, '');
  return name.replace(/\b\w/g, ch => ch.toUpperCase());
}

function toggleMod(root, filename, enabled) {
  const modsDir = path.join(root, 'mods');
  const base = path.basename(String(filename));
  if (base !== filename) throw new Error('Недопустимое имя файла');
  const current = path.join(modsDir, base);
  if (!exists(current)) throw new Error('Мод не найден');
  if (enabled) {
    if (!base.toLowerCase().endsWith('.jar.disabled')) return scanMods(root);
    const target = path.join(modsDir, base.slice(0, -'.disabled'.length));
    if (exists(target)) throw new Error('Файл с таким именем уже существует');
    fs.renameSync(current, target);
  } else {
    if (!base.toLowerCase().endsWith('.jar')) return scanMods(root);
    const target = path.join(modsDir, base + '.disabled');
    if (exists(target)) throw new Error('Файл с таким именем уже существует');
    fs.renameSync(current, target);
  }
  return scanMods(root);
}

const javaCache = new Map();

function parseJavaMajor(version) {
  if (!version) return 0;
  const m = String(version).match(/^(\d+)(?:\.(\d+))?/);
  if (!m) return 0;
  const first = Number(m[1]);
  if (first === 1 && m[2]) return Number(m[2]);
  return first;
}

function readJavaMeta(javaExe) {
  const key = path.resolve(javaExe).toLowerCase();
  if (javaCache.has(key)) return javaCache.get(key);
  let version = '';
  let major = 0;
  const home = path.dirname(path.dirname(javaExe));
  const releaseFile = path.join(home, 'release');
  try {
    const release = fs.readFileSync(releaseFile, 'utf8');
    const match = release.match(/JAVA_VERSION="([^"]+)"/);
    if (match) version = match[1];
  } catch {}
  if (!version) {
    try {
      const out = execFileSync(javaExe, ['-version'], { encoding: 'utf8', timeout: 6000, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
      version = (out.match(/version "([^"]+)"/) || [])[1] || '';
    } catch (err) {
      const text = `${err.stderr || ''}${err.stdout || ''}`;
      version = (text.match(/version "([^"]+)"/) || [])[1] || '';
    }
  }
  major = parseJavaMajor(version);
  const meta = {
    path: javaExe,
    version: version || 'неизвестно',
    major,
    vendor: detectVendor(home),
    source: home.includes('.minecraft') ? 'Mojang Runtime' : 'Системная Java',
  };
  javaCache.set(key, meta);
  return meta;
}

function detectVendor(home) {
  const h = home.toLowerCase();
  if (h.includes('jre-legacy')) return 'Legacy JRE';
  if (h.includes('java-runtime-delta')) return 'Mojang JRE 21';
  if (h.includes('java-runtime-gamma')) return 'Mojang JRE 17';
  if (h.includes('java-runtime-beta')) return 'Mojang JRE 17';
  if (h.includes('java-runtime-alpha')) return 'Mojang JRE 16';
  if (h.includes('jdk')) return 'JDK';
  return 'JRE';
}

function javaCandidates(root, preferred) {
  const paths = new Set();
  const add = p => {
    if (!p) return;
    try {
      if (fs.statSync(p).isFile()) paths.add(path.resolve(p));
    } catch {}
  };

  add(preferred);
  if (process.env.JAVA_HOME) add(path.join(process.env.JAVA_HOME, 'bin', 'java.exe'));

  const runtimeRoots = new Set([
    path.join(root, 'runtime'),
    path.join(process.env.APPDATA || '', '.minecraft', 'runtime'),
  ]);
  for (const runtimeRoot of runtimeRoots) {
    let dirs = [];
    try { dirs = fs.readdirSync(runtimeRoot, { withFileTypes: true }).filter(e => e.isDirectory()); } catch { continue; }
    for (const d of dirs) {
      const platformRoot = path.join(runtimeRoot, d.name);
      let platforms = [];
      try { platforms = fs.readdirSync(platformRoot, { withFileTypes: true }).filter(e => e.isDirectory()); } catch { continue; }
      for (const p of platforms) {
        if (!/windows|win/i.test(p.name)) continue;
        const versionRoot = path.join(platformRoot, p.name);
        let versions = [];
        try { versions = fs.readdirSync(versionRoot, { withFileTypes: true }).filter(e => e.isDirectory()); } catch { continue; }
        for (const v of versions) add(path.join(versionRoot, v.name, 'bin', 'java.exe'));
      }
    }
  }

  const programRoots = [
    'C:\\Program Files\\Java',
    'C:\\Program Files\\Eclipse Adoptium',
    'C:\\Program Files\\BellSoft',
    'C:\\Program Files\\Zulu',
    'C:\\Program Files\\Microsoft',
    'C:\\Program Files\\Amazon Corretto',
  ];
  for (const base of programRoots) {
    let dirs = [];
    try { dirs = fs.readdirSync(base, { withFileTypes: true }).filter(e => e.isDirectory()); } catch { continue; }
    for (const d of dirs) add(path.join(base, d.name, 'bin', 'java.exe'));
  }

  const metas = [];
  for (const p of paths) {
    const meta = readJavaMeta(p);
    if (meta.major > 0) metas.push(meta);
  }
  metas.sort((a, b) => b.major - a.major || a.version.localeCompare(b.version));
  return metas;
}

function requiredJavaFor(base, versionJson) {
  if (versionJson?.javaVersion?.majorVersion) return versionJson.javaVersion.majorVersion;
  const m = String(base).match(/^1\.(\d+)(?:\.(\d+))?/);
  if (!m) return 21;
  const minor = Number(m[1]);
  const patch = Number(m[2] || 0);
  if (minor >= 21) return 21;
  if (minor === 20) return patch >= 5 ? 21 : 17;
  if (minor >= 18) return 17;
  if (minor === 17) return 16;
  return 8;
}

function getVersionJson(root, version) {
  const folder = version.folder || version.key;
  const base = version.base || folder;
  const candidates = [
    path.join(root, 'versions', folder, `${folder}.json`),
    path.join(root, 'versions', base, `${base}.json`),
  ];
  for (const file of candidates) {
    const json = safeReadJson(file);
    if (json) return json;
  }
  return null;
}

function requiredJava(root, version) {
  return requiredJavaFor(version.base, getVersionJson(root, version));
}

function chooseJava(metas, required, preferredPath) {
  if (!metas.length) return { chosen: null, required };
  if (preferredPath) {
    const pref = metas.find(j => path.resolve(j.path).toLowerCase() === path.resolve(preferredPath).toLowerCase());
    if (pref && pref.major >= required) return { chosen: pref, required };
  }
  const exact = metas.find(j => j.major === required);
  if (exact) return { chosen: exact, required };
  const newer = metas.filter(j => j.major >= required).sort((a, b) => a.major - b.major)[0];
  if (newer) return { chosen: newer, required };
  return { chosen: metas[0], required };
}

function systemInfo() {
  return {
    totalMemGb: Math.round(os.totalmem() / 1024 / 1024 / 1024),
    freeMemGb: Math.round(os.freemem() / 1024 / 1024 / 1024),
    cpus: os.cpus()?.[0]?.model?.trim() || 'CPU',
    platform: os.platform(),
    release: os.release(),
    hostname: os.hostname(),
  };
}

function getLogsDir() { return LOG_DIR; }
function getAppDir() { return APP_DIR; }

module.exports = {
  APP_DIR,
  LOG_DIR,
  DEFAULT_RESOLUTION,
  ensureDirs,
  loadConfig,
  saveConfig,
  updateConfig,
  scanVersions,
  scanMods,
  toggleMod,
  countWorlds,
  prettyModName,
  javaCandidates,
  chooseJava,
  requiredJava,
  getVersionJson,
  systemInfo,
  getLogsDir,
  getAppDir,
};
