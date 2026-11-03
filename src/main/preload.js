'use strict';

const { contextBridge, ipcRenderer } = require('electron');

const listen = (channel, callback) => {
  const handler = (_event, payload) => callback(payload);
  ipcRenderer.on(channel, handler);
  return () => ipcRenderer.removeListener(channel, handler);
};

contextBridge.exposeInMainWorld('ember', {
  init: () => ipcRenderer.invoke('app:init'),
  rescan: () => ipcRenderer.invoke('app:rescan'),
  updateConfig: patch => ipcRenderer.invoke('config:update', patch),
  saveAccount: nickname => ipcRenderer.invoke('account:save', nickname),
  accountUuid: nickname => ipcRenderer.invoke('account:uuid', nickname),
  availableVersions: () => ipcRenderer.invoke('versions:available'),
  installVersion: payload => ipcRenderer.invoke('game:install', payload),
  launch: payload => ipcRenderer.invoke('game:launch', payload),
  kill: () => ipcRenderer.invoke('game:kill'),
  listMods: () => ipcRenderer.invoke('mods:list'),
  toggleMod: payload => ipcRenderer.invoke('mods:toggle', payload),
  pickFolder: () => ipcRenderer.invoke('dialog:pick-folder'),
  pickJava: () => ipcRenderer.invoke('dialog:pick-java'),
  open: kind => ipcRenderer.invoke('shell:open', kind),
  showLog: file => ipcRenderer.invoke('shell:show-log', file),
  external: url => ipcRenderer.invoke('app:external', url),
  windowMinimize: () => ipcRenderer.invoke('window:minimize'),
  windowMaximize: () => ipcRenderer.invoke('window:maximize'),
  windowClose: () => ipcRenderer.invoke('window:close'),
  windowState: () => ipcRenderer.invoke('window:state'),
  onLaunch: cb => listen('launch:event', cb),
  onInstall: cb => listen('install:event', cb),
  onStats: cb => listen('stats:update', cb),
  onLibrary: cb => listen('library:update', cb),
  onWindowState: cb => listen('window:state', cb),
});
