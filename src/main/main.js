'use strict';

const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const store = require('./store');
const mc = require('./minecraft');

const ROOT_DIR = path.join(__dirname, '..', '..');
const RENDERER_INDEX = path.join(ROOT_DIR, 'src', 'renderer', 'index.html');
const ICON = path.join(ROOT_DIR, 'assets', 'icons', 'icon.ico');
const SHOT_MODE = process.argv.includes('--screenshot');

app.setName('Ember Launcher');
if (!SHOT_MODE) {
  app.setPath('userData', path.join(process.env.APPDATA || app.getPath('appData'), 'EmberLauncher'));
}
app.commandLine.appendSwitch('force-color-profile', 'srgb');

let mainWindow = null;
let launchController = null;
let launchState = { running: false, startedAt: null, versionKey: null, finished: false };
let cachedOnline = { value: false, checkedAt: 0 };

function send(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function getWindowState() {
  if (!mainWindow) return { maximized: false };
  return { maximized: mainWindow.isMaximized() };
}

async function checkOnline() {
  if (Date.now() - cachedOnline.checkedAt < 60 * 1000) return cachedOnline.value;
  try {
    await mc.getManifest();
    cachedOnline = { value: true, checkedAt: Date.now() };
  } catch {
    cachedOnline = { value: false, checkedAt: Date.now() };
  }
  return cachedOnline.value;
}

function buildVersions(config, javaList) {
  const versions = store.scanVersions(config.root);
  return versions.map(v => {
    const required = store.requiredJava(config.root, v);
    const chosen = store.chooseJava(javaList, required, config.javaPath);
    return {
      ...v,
      requiredJava: required,
      javaVersion: chosen.chosen?.major || 0,
      javaOk: Boolean(chosen.chosen && chosen.chosen.major >= required),
    };
  });
}

async function buildState(config) {
  const javaList = store.javaCandidates(config.root, config.javaPath);
  const versions = buildVersions(config, javaList);
  const mods = store.scanMods(config.root);
  const online = await checkOnline();
  return {
    config,
    versions,
    mods,
    java: javaList,
    worlds: store.countWorlds(config.root),
    online,
    system: store.systemInfo(),
    appVersion: app.getVersion(),
    paths: {
      app: store.getAppDir(),
      logs: store.getLogsDir(),
      root: config.root,
    },
  };
}

function isInside(parent, child) {
  const rel = path.relative(path.resolve(parent), path.resolve(child));
  return rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function registerIpc() {
  ipcMain.handle('app:init', async () => {
    const config = store.loadConfig();
    return buildState(config);
  });

  ipcMain.handle('app:rescan', async () => {
    const config = store.loadConfig();
    return buildState(config);
  });

  ipcMain.handle('config:update', async (_event, patch) => {
    if (!patch || typeof patch !== 'object') throw new Error('Некорректные настройки');
    const before = store.loadConfig();
    const allowed = {};
    for (const key of ['nickname', 'root', 'ram', 'javaPath', 'resolution', 'fullscreen', 'closeOnLaunch', 'lastVersionKey', 'backgroundMotion', 'particles']) {
      if (Object.prototype.hasOwnProperty.call(patch, key)) allowed[key] = patch[key];
    }
    if (allowed.nickname && !/^[A-Za-z0-9_]{3,16}$/.test(allowed.nickname)) {
      throw new Error('Никнейм должен содержать 3–16 символов: латиница, цифры или _');
    }
    if (allowed.root) {
      const st = fs.statSync(allowed.root);
      if (!st.isDirectory()) throw new Error('Папка игры не найдена');
    }
    if (allowed.ram != null) {
      const total = store.systemInfo().totalMemGb;
      allowed.ram = Math.max(1, Math.min(Math.max(2, total - 1), Math.round(Number(allowed.ram) || 4)));
    }
    const config = store.updateConfig(allowed);
    const needsRescan = Object.prototype.hasOwnProperty.call(allowed, 'root') || Object.prototype.hasOwnProperty.call(allowed, 'javaPath');
    if (needsRescan) {
      return { config, state: await buildState(config) };
    }
    return { config };
  });

  ipcMain.handle('account:uuid', async (_event, nickname) => {
    const name = String(nickname || '').trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) return '';
    return mc.offlineUuid(name);
  });

  ipcMain.handle('account:save', async (_event, nickname) => {
    if (!/^[A-Za-z0-9_]{3,16}$/.test(String(nickname))) {
      throw new Error('Никнейм должен содержать 3–16 символов: латиница, цифры или _');
    }
    const config = store.updateConfig({ nickname: String(nickname) });
    return config;
  });

  ipcMain.handle('versions:available', async () => {
    const data = await mc.getAvailableVersions();
    const config = store.loadConfig();
    const installed = new Set(store.scanVersions(config.root).map(v => v.key));
    return {
      latest: data.latest,
      versions: data.versions.map(v => ({ ...v, installed: installed.has(v.id) })),
    };
  });

  ipcMain.handle('game:install', async (_event, payload) => {
    if (!payload || !payload.id || !payload.url) throw new Error('Нет данных версии');
    if (launchState.running) throw new Error('Игра уже запускается');
    const config = store.loadConfig();
    const existing = store.scanVersions(config.root).find(v => v.key === payload.id);
    if (existing) return { ok: true, version: existing, alreadyInstalled: true };
    const result = await mc.installVersion({
      root: config.root,
      id: payload.id,
      url: payload.url,
      onProgress: p => send('install:event', { id: payload.id, ...p }),
    });
    if (!result.version) throw new Error('Версия установлена, но не найдена в папке versions');
    const state = await buildState(config);
    send('library:update', { versions: state.versions, mods: state.mods, java: state.java, worlds: state.worlds });
    return { ok: true, version: result.version };
  });

  ipcMain.handle('game:launch', async (_event, payload) => {
    if (launchState.running) return { ok: false, error: 'Игра уже запускается' };
    const config = store.loadConfig();
    const versions = store.scanVersions(config.root);
    const version = versions.find(v => v.key === payload?.key);
    if (!version) return { ok: false, error: 'Версия не найдена' };
    if (!version.jar) return { ok: false, error: 'Клиент версии повреждён: отсутствует .jar' };
    if (version.missingBase) return { ok: false, error: 'Не найдена базовая версия для этого профиля' };

    const javaList = store.javaCandidates(config.root, config.javaPath);
    const required = store.requiredJava(config.root, version);
    const { chosen } = store.chooseJava(javaList, required, config.javaPath);
    if (!chosen) {
      return { ok: false, error: 'Java не найдена. Установите Java или укажите путь в настройках.', code: 'no-java' };
    }
    if (chosen.major < required) {
      return {
        ok: false,
        error: `Для версии ${version.base} нужна Java ${required}, найдена только Java ${chosen.major}. Укажите подходящий путь в настройках.`,
        code: 'java-too-old',
        required,
        found: chosen.major,
      };
    }

    launchState = { running: true, startedAt: null, versionKey: version.key, finished: false };
    store.updateConfig({ lastVersionKey: version.key });
    send('launch:event', {
      type: 'begin',
      version,
      java: chosen,
      memory: config.ram,
      resolution: config.resolution,
    });

    const controller = mc.launchVersion({
      root: config.root,
      config,
      version,
      java: chosen,
      onEvent: event => {
        if (event.type === 'started') {
          launchState.startedAt = Date.now();
          const fresh = store.loadConfig();
          store.updateConfig({
            launches: Number(fresh.launches || 0) + 1,
            lastPlayedAt: new Date().toISOString(),
            lastVersionPlayed: version.key,
            lastVersionKey: version.key,
            activeSessionStart: Date.now(),
          });
          send('stats:update', {
            launches: Number(fresh.launches || 0) + 1,
            lastPlayedAt: new Date().toISOString(),
            totalPlaytimeMs: Number(fresh.playtimeMs || 0),
          });
          if (config.closeOnLaunch) {
            setTimeout(() => {
              if (mainWindow && !mainWindow.isDestroyed()) mainWindow.hide();
            }, 1800);
          }
        }
        if (event.type === 'error') {
          finalizeSession(false);
          launchState.running = false;
          launchState.finished = true;
        }
        if (event.type === 'closed') {
          finalizeSession(true);
          launchState.running = false;
          launchState.finished = true;
          launchController = null;
          if (config.closeOnLaunch && mainWindow && !mainWindow.isDestroyed()) {
            setTimeout(() => {
              if (mainWindow && !mainWindow.isDestroyed()) mainWindow.show();
            }, 800);
          }
        }
        send('launch:event', event);
      },
    });
    launchController = controller;
    controller.promise.catch(() => {
      finalizeSession(false);
      launchState.running = false;
      launchState.finished = true;
      launchController = null;
    });
    return { ok: true };
  });

  ipcMain.handle('game:kill', async () => {
    if (!launchController) return { ok: false };
    await launchController.kill();
    return { ok: true };
  });

  ipcMain.handle('mods:list', async () => {
    const config = store.loadConfig();
    return store.scanMods(config.root);
  });

  ipcMain.handle('mods:toggle', async (_event, payload) => {
    const config = store.loadConfig();
    const mods = store.toggleMod(config.root, payload.filename, Boolean(payload.enabled));
    return { mods, count: mods.filter(m => m.enabled).length };
  });

  ipcMain.handle('dialog:pick-folder', async () => {
    const config = store.loadConfig();
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Выберите папку игры',
      defaultPath: config.root,
      properties: ['openDirectory'],
      buttonLabel: 'Выбрать папку',
    });
    if (result.canceled || !result.filePaths[0]) return { canceled: true };
    const root = result.filePaths[0];
    const updated = store.updateConfig({ root });
    return { canceled: false, state: await buildState(updated) };
  });

  ipcMain.handle('dialog:pick-java', async () => {
    const config = store.loadConfig();
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Выберите java.exe',
      defaultPath: path.join(config.root, 'runtime'),
      properties: ['openFile'],
      filters: [{ name: 'Java', extensions: ['exe'] }],
      buttonLabel: 'Выбрать',
    });
    if (result.canceled || !result.filePaths[0]) return { canceled: true };
    const javaPath = result.filePaths[0];
    const updated = store.updateConfig({ javaPath });
    return { canceled: false, state: await buildState(updated) };
  });

  ipcMain.handle('shell:open', async (_event, kind) => {
    const config = store.loadConfig();
    const map = {
      root: config.root,
      mods: path.join(config.root, 'mods'),
      logs: path.join(config.root, 'logs'),
      versions: path.join(config.root, 'versions'),
      saves: path.join(config.root, 'saves'),
      launcher: store.getAppDir(),
      launcherLogs: store.getLogsDir(),
    };
    const target = map[kind] || kind;
    if (!target) return { ok: false };
    try {
      if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
      if (kind === 'launcherLogs' || kind === 'launcher') {
        await shell.openPath(target);
      } else if (isInside(config.root, target) || isInside(store.getAppDir(), target)) {
        await shell.openPath(target);
      } else {
        return { ok: false, error: 'Путь вне папки игры' };
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  });

  ipcMain.handle('shell:show-log', async (_event, file) => {
    if (!file) return { ok: false };
    const logs = store.getLogsDir();
    if (!isInside(logs, file) && path.resolve(file) !== path.resolve(logs)) return { ok: false };
    if (fs.existsSync(file)) shell.showItemInFolder(file);
    else shell.openPath(logs);
    return { ok: true };
  });

  ipcMain.handle('app:external', async (_event, url) => {
    try {
      const u = new URL(url);
      if (!/^https?:$/.test(u.protocol)) return { ok: false };
      await shell.openExternal(u.toString());
      return { ok: true };
    } catch {
      return { ok: false };
    }
  });

  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:maximize', () => {
    if (!mainWindow) return getWindowState();
    if (mainWindow.isMaximized()) mainWindow.unmaximize();
    else mainWindow.maximize();
    return getWindowState();
  });
  ipcMain.handle('window:close', () => mainWindow?.close());
  ipcMain.handle('window:state', () => getWindowState());
}

function finalizeSession(addTime) {
  const config = store.loadConfig();
  if (!config.activeSessionStart) return;
  const started = Number(config.activeSessionStart);
  if (addTime !== false && Number.isFinite(started)) {
    const elapsed = Math.max(0, Math.min(Date.now() - started, 24 * 60 * 60 * 1000));
    store.updateConfig({ playtimeMs: Number(config.playtimeMs || 0) + elapsed, activeSessionStart: null });
    send('stats:update', {
      launches: Number(config.launches || 0),
      lastPlayedAt: config.lastPlayedAt,
      totalPlaytimeMs: Number(config.playtimeMs || 0) + elapsed,
    });
  } else {
    store.updateConfig({ activeSessionStart: null });
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1120,
    minHeight: 720,
    show: false,
    frame: false,
    backgroundColor: '#07090c',
    title: 'Ember Launcher',
    icon: ICON,
    roundedCorners: true,
    hasShadow: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      devTools: true,
    },
  });

  mainWindow = win;
  Menu.setApplicationMenu(null);
  win.setMenuBarVisibility(false);

  win.loadFile(RENDERER_INDEX);

  win.once('ready-to-show', () => {
    win.show();
  });

  win.on('maximize', () => send('window:state', getWindowState()));
  win.on('unmaximize', () => send('window:state', getWindowState()));
  win.on('closed', () => { mainWindow = null; });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file:')) event.preventDefault();
  });

  if (process.argv.includes('--dev')) win.webContents.openDevTools({ mode: 'detach' });

  if (SHOT_MODE) captureShots(win);
  return win;
}

async function captureShots(win) {
  const shotsDir = path.join(ROOT_DIR, 'shots');
  fs.mkdirSync(shotsDir, { recursive: true });
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const run = async (label, script) => {
    try {
      const result = await win.webContents.executeJavaScript(script, true);
      console.log(`[shot:${label}]`, JSON.stringify(result));
      return result;
    } catch (error) {
      console.error(`[shot:${label}] failed`, error && error.message ? error.message : error);
      return null;
    }
  };
  try {
    win.webContents.on('console-message', (...args) => {
      const event = args[0];
      if (event && typeof event === 'object' && 'message' in event) {
        console.log(`[renderer:${event.level}] ${event.message}`);
      } else {
        console.log(`[renderer] ${args[2] || args[1] || ''}`);
      }
    });
    await new Promise(resolve => win.webContents.once('did-finish-load', resolve));
    for (let i = 0; i < 90; i += 1) {
      const ready = await win.webContents.executeJavaScript('Boolean(window.__emberReady)').catch(() => false);
      if (ready) break;
      await wait(250);
    }
    await run('diag', `(() => {
      const view = document.querySelector('#view');
      return {
        ready: Boolean(window.__emberReady),
        splash: document.querySelector('#splash') ? getComputedStyle(document.querySelector('#splash')).visibility : 'none',
        app: document.querySelector('#app') ? document.querySelector('#app').className : 'none',
        viewLength: view ? view.innerHTML.length : -1,
        viewText: view ? view.innerText.slice(0, 120) : '',
      };
    })()`);
    // Wait out the splash transition and first paint.
    await wait(1600);

    const pages = ['home', 'versions', 'mods', 'settings'];
    for (const page of pages) {
      await run(page, `window.__emberScreenshot && window.__emberScreenshot('${page}')`);
      await wait(900);
      const image = await win.webContents.capturePage();
      fs.writeFileSync(path.join(shotsDir, `${page}.png`), image.toPNG());
      console.log(`[shot] ${page}`);
    }
    await run('available', `window.__emberScreenshot && window.__emberScreenshot('versions', 'available')`);
    await wait(1800);
    let image = await win.webContents.capturePage();
    fs.writeFileSync(path.join(shotsDir, 'available.png'), image.toPNG());
    console.log('[shot] available');

    await run('account', `window.__emberScreenshot && window.__emberScreenshot('home', 'account')`);
    await wait(900);
    image = await win.webContents.capturePage();
    fs.writeFileSync(path.join(shotsDir, 'account.png'), image.toPNG());
    console.log('[shot] account');

    await run('launch', `window.__emberScreenshot && window.__emberScreenshot('home', 'launch-demo')`);
    await wait(1100);
    image = await win.webContents.capturePage();
    fs.writeFileSync(path.join(shotsDir, 'launch.png'), image.toPNG());
    console.log('[shot] launch');
  } catch (err) {
    console.error('[shot] failed', err);
  } finally {
    setTimeout(() => app.quit(), 500);
  }
}

const gotLock = SHOT_MODE ? true : app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    store.ensureDirs();
    registerIpc();
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('before-quit', () => {
    if (launchState.startedAt) finalizeSession(true);
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin' || SHOT_MODE) app.quit();
  });
}
