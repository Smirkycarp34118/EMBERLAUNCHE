'use strict';

(() => {
  /* ============================================================
     Constants
     ============================================================ */

  const IMAGES = {
    canyon: '../../assets/images/canyon-dusk.jpg',
    cliffs: '../../assets/images/cliffs-sunset.jpg',
    jungle: '../../assets/images/jungle-cathedral.jpg',
  };
  const IMAGE_LIST = [IMAGES.canyon, IMAGES.cliffs, IMAGES.jungle];
  const MONTHS = ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];

  const PAGES = {
    home: { kicker: 'ЛАУНЧЕР', crumb: 'Обзор' },
    versions: { kicker: 'БИБЛИОТЕКА', crumb: 'Версии' },
    mods: { kicker: 'МОДИФИКАЦИИ', crumb: 'Моды' },
    settings: { kicker: 'КОНФИГУРАЦИЯ', crumb: 'Настройки' },
  };

  const LOADERS = {
    vanilla: { label: 'Vanilla', short: 'VANILLA', cls: 'chip-vanilla' },
    fabric: { label: 'Fabric', short: 'FABRIC', cls: 'chip-fabric' },
    forge: { label: 'Forge', short: 'FORGE', cls: 'chip-forge' },
    neoforge: { label: 'NeoForge', short: 'NEOFORGE', cls: 'chip-neoforge' },
    quilt: { label: 'Quilt', short: 'QUILT', cls: 'chip-quilt' },
    custom: { label: 'Сборка', short: 'CUSTOM', cls: 'chip-custom' },
  };

  const ICONS = {
    home: '<path d="M4 10.8 12 4l8 6.8V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19v-8.2Z"/><path d="M9.4 20.4v-6.2h5.2v6.2"/>',
    layers: '<path d="m12 3.2 8.6 4.8L12 12.8 3.4 8 12 3.2Z"/><path d="m3.4 12.2 8.6 4.8 8.6-4.8"/><path d="m3.4 16.2 8.6 4.8 8.6-4.8"/>',
    puzzle: '<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><path d="M17 13.5v7M13.5 17h7"/>',
    sliders: '<path d="M4 7h5.6M14.4 7H20M4 12h9.6M18.4 12H20M4 17h3.6M12.4 17H20"/><circle cx="12" cy="7" r="2.2"/><circle cx="16" cy="12" r="2.2"/><circle cx="10" cy="17" r="2.2"/>',
    more: '<circle cx="5.5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="18.5" cy="12" r="1.3" fill="currentColor" stroke="none"/>',
    minimize: '<path d="M5 12h14"/>',
    maximize: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    play: '<path d="M8 5.2v13.6L19 12 8 5.2Z"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/>',
    arrowRight: '<path d="M4.5 12h15M13 5.5l6.5 6.5L13 18.5"/>',
    arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2 2 0 0 1 20.5 9v7.5a2.5 2.5 0 0 1-2.5 2.5H5.5A2.5 2.5 0 0 1 3 16.5v-9Z"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.35 5.65M20 4v7h-7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.4 15.4 4.1 4.1"/>',
    check: '<path d="m5 12.4 4.3 4.3L19 7"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2M12 7.8h.01"/>',
    alert: '<path d="M12 4.2 21 19.5H3L12 4.2Z"/><path d="M12 9.5v4.2M12 17h.01"/>',
    download: '<path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14"/>',
    edit: '<path d="m4 20 4.3-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z"/>',
    chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3.5v3.5M14 3.5v3.5M10 17v3.5M14 17v3.5M3.5 10H7M3.5 14H7M17 10h3.5M17 14h3.5"/>',
    java: '<path d="M4.5 8.5h11v5.2a4.3 4.3 0 0 1-4.3 4.3H8.8a4.3 4.3 0 0 1-4.3-4.3V8.5Z"/><path d="M15.5 9.5h1.9a2.3 2.3 0 0 1 0 4.6h-1.9"/><path d="M8 3.5v2M11.5 3.5v2"/>',
    monitor: '<rect x="3.5" y="4.5" width="17" height="11.5" rx="2"/><path d="M9 20h6M12 16v4"/>',
    sparkles: '<path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9 12 3.5Z"/><path d="m18.5 16.5.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5Z"/>',
    zap: '<path d="M13 3 5.5 13.2h5.2L10.5 21l7.8-10.4h-5.4L13 3Z"/>',
    shield: '<path d="M12 3 20 6v5c0 5-3.5 8.3-8 10-4.5-1.7-8-5-8-10V6l8-3Z"/><path d="m8.7 11.8 2.2 2.2 4.4-4.4"/>',
    box: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.8 9.5h16.4M3.8 14.5h16.4M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.8 20.2c.7-3.5 3.5-5.6 7.2-5.6s6.5 2.1 7.2 5.6"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 8.5V6.7A2.2 2.2 0 0 0 13.3 4.5H6.7A2.2 2.2 0 0 0 4.5 6.7v6.6a2.2 2.2 0 0 0 2.2 2.2h1.8"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="4.5" cy="18" r="1.1" fill="currentColor" stroke="none"/>',
  };

  const FILLED_ICONS = new Set(['play', 'stop', 'more']);

  /* ============================================================
     Helpers
     ============================================================ */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function icon(name, cls = 'ic') {
    const body = ICONS[name] || ICONS.box;
    const filled = FILLED_ICONS.has(name);
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="${filled ? 'none' : 'currentColor'}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const escapeAttr = escapeHtml;

  function capitalize(text) {
    const str = String(text || '');
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function formatBytes(bytes) {
    const size = Number(bytes) || 0;
    if (size <= 0) return '0 Б';
    if (size < 1024) return `${size} Б`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} КБ`;
    if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(size > 100 * 1024 * 1024 ? 0 : 1)} МБ`;
    return `${(size / 1024 / 1024 / 1024).toFixed(1)} ГБ`;
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '—';
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }

  function relativeDate(iso) {
    if (!iso) return 'ещё не запускалась';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return 'ещё не запускалась';
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days <= 0) return 'сегодня';
    if (days === 1) return 'вчера';
    if (days < 7) return `${days} дн. назад`;
    return formatDate(iso);
  }

  function formatPlaytime(ms) {
    const minutes = Math.floor((Number(ms) || 0) / 60000);
    if (minutes < 1) return '0 мин';
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `${hours} ч ${rest} м` : `${hours} ч`;
  }

  function greeting() {
    const hour = new Date().getHours();
    if (hour < 5) return 'Доброй ночи';
    if (hour < 12) return 'Доброе утро';
    if (hour < 18) return 'Добрый день';
    return 'Добрый вечер';
  }

  function cleanError(error) {
    const text = String((error && error.message) || error || 'Неизвестная ошибка');
    return text.replace(/^Error invoking remote method '[^']+':\s*(Error:\s*)?/, '').trim();
  }

  function hashSeed(text) {
    let hash = 2166136261;
    const str = String(text || '');
    for (let i = 0; i < str.length; i += 1) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function mulberry32(seed) {
    let value = seed >>> 0;
    return () => {
      value = (value + 0x6D2B79F5) | 0;
      let t = Math.imul(value ^ (value >>> 15), 1 | value);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function imageFor(key) {
    const index = hashSeed(key || 'ember') % IMAGE_LIST.length;
    return IMAGE_LIST[index];
  }

  function loaderInfo(loader) {
    return LOADERS[loader] || LOADERS.custom;
  }

  function brandMark() {
    return `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 5.5 33 13v14L20 34.5 7 27V13L20 5.5Z" fill="none" stroke="#ffb15e" stroke-width="1.5"/><path d="M7 13l13 7.5L33 13M20 20.5V34.5" stroke="#ffb15e" stroke-width="1.2" opacity=".8"/><path d="M20 11.5l7 4.1-7 4-7-4 7-4Z" fill="#ffb15e" opacity=".28"/></svg>`;
  }

  /* ============================================================
     State
     ============================================================ */

  const state = {
    page: 'home',
    config: {
      nickname: 'Steve',
      root: '',
      ram: 4,
      javaPath: '',
      resolution: { width: 1280, height: 720 },
      fullscreen: false,
      closeOnLaunch: false,
      lastVersionKey: '',
      lastVersionPlayed: '',
      lastPlayedAt: null,
      launches: 0,
      playtimeMs: 0,
      backgroundMotion: true,
      particles: true,
    },
    versions: [],
    mods: [],
    java: [],
    worlds: 0,
    online: false,
    system: { totalMemGb: 8, freeMemGb: 4, cpus: '' },
    appVersion: '1.0.0',
    paths: {},
    selected: null,
    filters: {
      versions: 'all',
      versionQuery: '',
      modsQuery: '',
      availableType: 'release',
      availableQuery: '',
    },
    available: { loaded: false, loading: false, error: null, versions: [], latest: null },
    install: null,
    modal: null,
    launch: {
      open: false,
      demo: false,
      running: false,
      started: false,
      closed: false,
      error: null,
      errorCode: null,
      key: null,
      percent: 0,
      stage: '',
      file: '',
      logs: [],
      version: null,
    },
    uuidCache: {},
    busyMods: new Set(),
    ready: false,
  };

  let splashTimers = [];
  let ramSaveTimer = null;
  let savedTimer = null;
  let toastTimer = null;
  let parallaxFrame = null;

  /* ============================================================
     Boot / splash
     ============================================================ */

  async function boot() {
    hydrateStaticIcons();
    bindEvents();
    startEmbers();
    startBackground();

    const timers = [
      [700, 'Сканируем библиотеку', 42],
      [1600, 'Проверяем Java', 66],
      [2700, 'Собираем интерфейс', 84],
    ];
    for (const [delay, text, percent] of timers) {
      splashTimers.push(setTimeout(() => setSplash(text, percent), delay));
    }

    try {
      if (!window.ember) throw new Error('Мост приложения недоступен');
      const payload = await window.ember.init();
      applyState(payload);
      finishBoot();
    } catch (error) {
      showBootError(error);
    }
  }

  function setSplash(text, percent) {
    const status = $('#splash-status');
    const bar = $('#splash-bar');
    if (status) status.textContent = text;
    if (bar && percent != null) {
      bar.style.animation = 'none';
      bar.style.width = `${percent}%`;
      bar.style.transform = 'none';
    }
  }

  function finishBoot() {
    splashTimers.forEach(clearTimeout);
    splashTimers = [];
    setSplash('Готово', 100);
    state.ready = true;
    window.__emberReady = true;
    setTimeout(() => {
      const splash = $('#splash');
      const app = $('#app');
      if (splash) splash.classList.add('is-done');
      if (app) {
        app.classList.remove('is-loading');
        app.classList.add('is-ready');
        app.setAttribute('aria-hidden', 'false');
      }
      render();
      const view = $('#view');
      if (view) view.scrollTop = 0;
    }, 320);
    setTimeout(() => {
      if (!state.available.loaded && !state.available.loading) loadAvailable({ silent: true });
    }, 1100);
  }

  function showBootError(error) {
    console.error('[Ember] boot failed', error);
    const status = $('#splash-status');
    const splash = $('#splash');
    const bar = $('#splash-bar');
    if (status) {
      status.textContent = `${cleanError(error)}. Нажмите, чтобы повторить.`;
      status.classList.add('is-error');
    }
    if (bar) {
      bar.style.animation = 'none';
      bar.style.width = '100%';
      bar.style.transform = 'none';
      bar.style.background = 'linear-gradient(90deg, transparent, #ff6363)';
    }
    if (splash) {
      splash.style.cursor = 'pointer';
      splash.addEventListener('click', () => window.location.reload(), { once: true });
    }
  }

  function applyState(payload) {
    if (!payload || typeof payload !== 'object') return;
    state.config = Object.assign({}, state.config, payload.config || {});
    state.config.resolution = Object.assign({ width: 1280, height: 720 }, state.config.resolution || {});
    state.versions = Array.isArray(payload.versions) ? payload.versions : state.versions;
    state.mods = Array.isArray(payload.mods) ? payload.mods : state.mods;
    state.java = Array.isArray(payload.java) ? payload.java : state.java;
    state.worlds = Number.isFinite(payload.worlds) ? payload.worlds : state.worlds;
    state.online = Boolean(payload.online);
    state.system = Object.assign({}, state.system, payload.system || {});
    state.appVersion = payload.appVersion || state.appVersion;
    state.paths = Object.assign({}, state.paths, payload.paths || {});

    const keys = state.versions.map(version => version.key);
    if (!state.selected || !keys.includes(state.selected)) {
      state.selected = keys.includes(state.config.lastVersionKey) ? state.config.lastVersionKey : (keys[0] || null);
    }

    document.body.classList.toggle('no-motion', !state.config.backgroundMotion);
    document.body.classList.toggle('no-particles', !state.config.particles);
  }

  /* ============================================================
     Shell rendering / navigation
     ============================================================ */

  function hydrateStaticIcons() {
    $$('[data-icon]').forEach(node => {
      node.innerHTML = icon(node.dataset.icon);
    });
  }

  function hydrateAvatars(root = document) {
    $$('[data-avatar]', root).forEach(drawAvatar);
  }

  function renderShell() {
    const nick = state.config.nickname || 'Steve';
    const page = PAGES[state.page] || PAGES.home;

    const crumb = $('#page-crumb');
    const kicker = $('#page-kicker');
    if (crumb) crumb.textContent = page.crumb;
    if (kicker) kicker.textContent = page.kicker;

    $$('.nav-item').forEach(item => {
      const active = item.dataset.page === state.page;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-current', active ? 'page' : 'false');
    });

    const railName = $('#rail-name');
    if (railName) railName.textContent = nick;
    const railAvatar = $('#rail-avatar');
    if (railAvatar) {
      railAvatar.setAttribute('data-avatar', nick);
      drawAvatar(railAvatar);
    }

    let statusText = 'Локальный режим';
    let dotClass = 'status-dot is-off';
    if (state.launch.running) {
      statusText = 'Игра запущена';
      dotClass = 'status-dot';
    } else if (state.online) {
      statusText = 'Сеть доступна';
      dotClass = 'status-dot';
    }
    const railStatus = $('#rail-status');
    if (railStatus) railStatus.textContent = statusText;
    const railDot = $('#rail-dot');
    if (railDot) railDot.className = dotClass;

    const versionTag = $('.rail-version');
    if (versionTag) versionTag.textContent = `v${state.appVersion}`;

    const pill = $('#service-pill');
    if (pill) {
      pill.classList.toggle('is-online', state.online);
      pill.classList.toggle('is-offline', !state.online);
      pill.innerHTML = `<i class="status-dot ${state.online ? '' : 'is-off'}"></i><span>${state.online ? 'Mojang · онлайн' : 'Локальный режим'}</span>`;
    }

    document.body.classList.toggle('no-motion', !state.config.backgroundMotion);
    document.body.classList.toggle('no-particles', !state.config.particles);
  }

  function pageHtml() {
    switch (state.page) {
      case 'versions': return versionsHtml();
      case 'mods': return modsHtml();
      case 'settings': return settingsHtml();
      default: return homeHtml();
    }
  }

  function render() {
    if (!state.ready) return;
    renderShell();
    const view = $('#view');
    if (!view) return;
    const scroll = view.scrollTop;
    view.innerHTML = pageHtml();
    hydrateAvatars(view);
    updateUuidLabels();
    view.scrollTop = scroll;
  }

  function navigate(page) {
    if (!PAGES[page]) return;
    state.page = page;
    closePopover();
    render();
    const view = $('#view');
    if (view) {
      view.scrollTop = 0;
      view.focus({ preventScroll: true });
    }
  }

  /* ============================================================
     Version / data helpers
     ============================================================ */

  function getVersion(key) {
    return state.versions.find(version => version.key === key) || null;
  }

  function selectedVersion() {
    return getVersion(state.selected) || state.versions[0] || null;
  }

  function activeMods() {
    return state.mods.filter(mod => mod.enabled);
  }

  function selectVersion(key, options = {}) {
    if (!getVersion(key)) return;
    state.selected = key;
    state.config.lastVersionKey = key;
    savePatch({ lastVersionKey: key }, { silent: true });
    if (options.navigateTo) state.page = options.navigateTo;
    render();
    if (options.scrollTop) {
      const view = $('#view');
      if (view) view.scrollTop = 0;
    }
  }

  function versionChip(version, extraClass = '') {
    const info = loaderInfo(version.loader);
    return `<span class="chip ${info.cls} ${extraClass}"><i class="dot"></i>${escapeHtml(info.label)}</span>`;
  }

  function versionHealth(version) {
    if (!version) return { ok: false, text: 'Нет версий', error: true };
    if (version.missingBase) return { ok: false, text: 'Нет базовой версии', error: true };
    if (!version.jar) return { ok: false, text: 'Нет клиента', error: true };
    if (!version.javaOk) return { ok: false, text: `Нужна Java ${version.requiredJava}`, error: true };
    return { ok: true, text: 'Готова к запуску', error: false };
  }

  function heroSubtitle(version) {
    if (!version) return '';
    if (version.missingBase) return 'Для этого профиля не найдена базовая версия. Установите её через раздел «Версии».';
    if (!version.javaOk) return `Для запуска нужна Java ${version.requiredJava}, подходящая версия пока не найдена. Укажите путь к Java в настройках.`;
    const mods = activeMods().length;
    if (version.custom) {
      return `Профиль «${version.folder}» на ${loaderInfo(version.loader).label}. Java ${version.javaVersion}, ${state.config.ram} ГБ памяти, ${mods} активных модов.`;
    }
    return `Официальный клиент Minecraft ${version.base}. Java ${version.javaVersion}, ${state.config.ram} ГБ памяти, ${state.worlds} миров в сохранении.`;
  }

  function metaItem(iconName, text) {
    return `<span class="hero-meta-item">${icon(iconName)}<span>${escapeHtml(text)}</span></span>`;
  }

  function thumbnailFor(key) {
    return imageFor(key);
  }

  /* ============================================================
     Avatar painter
     ============================================================ */

  const AVATAR_HAIR = ['#2b1c12', '#4a2e1a', '#6b4525', '#1d1a17', '#3b2b20', '#77532f', '#28262d'];
  const AVATAR_SKIN = ['#e8b58e', '#dda378', '#f0c49e', '#c98c63', '#e5ad83', '#f2c9a4'];
  const AVATAR_SHIRT = ['#ff7a3c', '#597dff', '#51b58a', '#a06bff', '#f0a13e', '#d35757', '#2f3b4c'];
  const AVATAR_EYES = ['#2f6c86', '#3d7a43', '#4b3d7a', '#2e2e36', '#6b4a25'];

  function shadeColor(hex, amount) {
    const value = hex.replace('#', '');
    const num = parseInt(value.length === 3 ? value.split('').map(ch => ch + ch).join('') : value, 16);
    const r = clamp(((num >> 16) & 255) + amount, 0, 255);
    const g = clamp(((num >> 8) & 255) + amount, 0, 255);
    const b = clamp((num & 255) + amount, 0, 255);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function drawAvatar(element) {
    const name = element.getAttribute('data-avatar') || 'Steve';
    const random = mulberry32(hashSeed(name));

    const hair = AVATAR_HAIR[Math.floor(random() * AVATAR_HAIR.length)];
    const skin = AVATAR_SKIN[Math.floor(random() * AVATAR_SKIN.length)];
    const shirt = AVATAR_SHIRT[Math.floor(random() * AVATAR_SHIRT.length)];
    const eye = AVATAR_EYES[Math.floor(random() * AVATAR_EYES.length)];

    element.innerHTML = '<canvas width="32" height="32" aria-hidden="true"></canvas>';
    const canvas = element.querySelector('canvas');
    const ctx = canvas && canvas.getContext('2d');
    if (!ctx) return;

    const bg = ctx.createLinearGradient(0, 0, 0, 32);
    bg.addColorStop(0, '#1f232b');
    bg.addColorStop(1, '#0f1115');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 32, 32);

    const glow = ctx.createRadialGradient(26, 5, 0, 26, 5, 28);
    glow.addColorStop(0, 'rgba(255, 138, 68, 0.24)');
    glow.addColorStop(1, 'rgba(255, 138, 68, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 32, 32);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.045)';
    for (let i = 0; i < 10; i += 1) {
      ctx.fillRect(Math.floor(random() * 32), Math.floor(random() * 32), 1, 1);
    }

    // shoulders
    ctx.fillStyle = shirt;
    ctx.fillRect(5, 27, 22, 5);
    ctx.fillRect(7, 26, 18, 1);
    ctx.fillStyle = shadeColor(shirt, -26);
    ctx.fillRect(5, 30, 22, 2);
    ctx.fillStyle = shadeColor(shirt, 22);
    ctx.fillRect(12, 26, 8, 1);

    // neck
    ctx.fillStyle = shadeColor(skin, -16);
    ctx.fillRect(12, 23, 8, 4);

    // ears
    ctx.fillStyle = skin;
    ctx.fillRect(6, 14, 2, 5);
    ctx.fillRect(24, 14, 2, 5);
    ctx.fillStyle = shadeColor(skin, -34);
    ctx.fillRect(6, 15, 1, 3);
    ctx.fillRect(25, 15, 1, 3);

    // face
    ctx.fillStyle = skin;
    ctx.fillRect(8, 8, 16, 16);
    ctx.fillStyle = shadeColor(skin, -18);
    ctx.fillRect(8, 21, 16, 3);
    ctx.fillStyle = shadeColor(skin, 12);
    ctx.fillRect(9, 9, 6, 1);

    // hair
    ctx.fillStyle = hair;
    ctx.fillRect(7, 5, 18, 7);
    ctx.fillRect(8, 8, 2, 8);
    ctx.fillRect(22, 8, 2, 8);
    const fringe = Math.floor(random() * 3);
    if (fringe === 0) ctx.fillRect(9, 11, 6, 2);
    else if (fringe === 1) ctx.fillRect(17, 11, 6, 2);
    else ctx.fillRect(13, 11, 6, 1);
    ctx.fillStyle = shadeColor(hair, 24);
    ctx.fillRect(10, 6, 7, 1);
    ctx.fillRect(19, 7, 3, 1);

    // eyes
    ctx.fillStyle = '#f7f1e4';
    ctx.fillRect(11, 14, 3, 2);
    ctx.fillRect(18, 14, 3, 2);
    ctx.fillStyle = eye;
    ctx.fillRect(12, 14, 2, 2);
    ctx.fillRect(19, 14, 2, 2);
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.fillRect(12, 14, 1, 1);

    // brows, nose, mouth
    ctx.fillStyle = shadeColor(hair, -6);
    ctx.fillRect(11, 13, 3, 1);
    ctx.fillRect(18, 13, 3, 1);
    ctx.fillStyle = shadeColor(skin, -30);
    ctx.fillRect(15, 17, 2, 2);
    ctx.fillStyle = 'rgba(255, 135, 110, .3)';
    ctx.fillRect(10, 19, 2, 1);
    ctx.fillRect(20, 19, 2, 1);
    ctx.fillStyle = '#7a4a3a';
    ctx.fillRect(14, 21, 4, 1);

    // outline
    ctx.fillStyle = 'rgba(0, 0, 0, .22)';
    ctx.fillRect(8, 24, 16, 1);
    ctx.fillRect(7, 5, 1, 7);
    ctx.fillRect(24, 5, 1, 7);
    ctx.fillStyle = 'rgba(255, 255, 255, .08)';
    ctx.fillRect(8, 8, 1, 16);
  }

  /* ============================================================
     Toast / saved indicator
     ============================================================ */

  function toast(title, message = '', type = 'info') {
    const root = $('#toast-root');
    if (!root) return;
    while (root.children.length >= 3) root.firstElementChild.remove();
    const node = document.createElement('div');
    node.className = `toast ${type === 'success' ? 'is-success' : type === 'error' ? 'is-error' : ''}`;
    const iconName = type === 'success' ? 'check' : type === 'error' ? 'alert' : 'sparkles';
    node.innerHTML = `<span class="toast-icon">${icon(iconName)}</span><span class="toast-copy"><b>${escapeHtml(title)}</b>${message ? `<span>${escapeHtml(message)}</span>` : ''}</span>`;
    root.appendChild(node);
    const life = type === 'error' ? 5200 : 3600;
    setTimeout(() => {
      node.classList.add('is-out');
      setTimeout(() => node.remove(), 320);
    }, life);
  }

  function flashSaved() {
    const indicator = $('#settings-saved');
    if (!indicator) return;
    indicator.classList.add('is-on');
    if (savedTimer) clearTimeout(savedTimer);
    savedTimer = setTimeout(() => indicator.classList.remove('is-on'), 1800);
  }

  async function savePatch(patch, options = {}) {
    try {
      const result = await window.ember.updateConfig(patch);
      if (result && result.config) state.config = Object.assign(state.config, result.config);
      if (result && result.state) applyState(result.state);
      if (!options.silent) flashSaved();
      return result;
    } catch (error) {
      toast('Не удалось сохранить', cleanError(error), 'error');
      return null;
    }
  }

  /* ============================================================
     Background / particles
     ============================================================ */

  function startBackground() {
    const layers = $$('.bg-layer');
    if (!layers.length) return;
    let index = 0;
    layers.forEach((layer, i) => layer.classList.toggle('is-active', i === 0));
    setInterval(() => {
      index = (index + 1) % layers.length;
      layers.forEach((layer, i) => layer.classList.toggle('is-active', i === index));
    }, 24000);

    window.addEventListener('mousemove', event => {
      if (!state.config.backgroundMotion) return;
      if (parallaxFrame) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      parallaxFrame = requestAnimationFrame(() => {
        const app = $('#app');
        if (app) {
          app.style.setProperty('--mx', (-x).toFixed(3));
          app.style.setProperty('--my', (-y).toFixed(3));
        }
        parallaxFrame = null;
      });
    });
  }

  function startEmbers() {
    const canvas = $('#embers');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let last = performance.now();
    let resizeTimer = null;

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      const count = width < 900 ? 18 : 38;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.5 + Math.random() * 1.7,
        speed: 0.12 + Math.random() * 0.42,
        drift: (Math.random() - 0.5) * 0.18,
        alpha: 0.06 + Math.random() * 0.32,
        phase: Math.random() * Math.PI * 2,
        tint: Math.random() > 0.5 ? '255, 145, 78' : '255, 190, 120',
      }));
    }

    function frame(now) {
      const delta = Math.min(64, now - last) / 16.67;
      last = now;
      ctx.clearRect(0, 0, width, height);
      if (!document.body.classList.contains('no-particles')) {
        ctx.globalCompositeOperation = 'lighter';
        for (const particle of particles) {
          particle.y -= particle.speed * delta;
          particle.x += Math.sin(now * 0.00045 + particle.phase) * 0.18 * delta + particle.drift * delta;
          if (particle.y < -8) {
            particle.y = height + 8;
            particle.x = Math.random() * width;
          }
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
          ctx.beginPath();
          ctx.fillStyle = `rgba(${particle.tint}, ${particle.alpha})`;
          ctx.shadowColor = `rgba(${particle.tint}, .75)`;
          ctx.shadowBlur = 9;
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = 'source-over';
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 160);
    });

    resize();
    requestAnimationFrame(frame);
  }

  /* ============================================================
     Home page
     ============================================================ */

  function recentVersions(limit = 3) {
    const result = [];
    const add = version => {
      if (!version || result.some(item => item.key === version.key)) return;
      result.push(version);
    };
    add(selectedVersion());
    add(getVersion(state.config.lastVersionPlayed));
    for (const version of state.versions) {
      if (result.length >= limit) break;
      add(version);
    }
    return result.slice(0, limit);
  }

  function homeHtml() {
    const version = selectedVersion();
    const nick = state.config.nickname || 'Steve';
    const date = capitalize(new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }));
    const recent = recentVersions(3);
    const statusNote = state.online ? 'Сеть доступна' : 'Локальный режим';
    const running = state.launch.running;

    const subtitle = state.versions.length
      ? `В библиотеке ${state.versions.length} ${plural(state.versions.length, 'версия', 'версии', 'версий')}, ${activeMods().length} ${plural(activeMods().length, 'мод', 'мода', 'модов')} активно. Всё готово к следующему путешествию.`
      : 'Библиотека пока пуста. Установите официальную версию или добавьте готовую сборку — и можно отправляться в мир.';

    return `
      <div class="page home-page">
        <div class="page-head home-head">
          <div class="page-head-copy">
            <div class="eyebrow"><span>${escapeHtml(date)}</span><span class="sep"></span><span class="date">${escapeHtml(statusNote)}</span></div>
            <h1>${greeting()}, <em>${escapeHtml(nick)}</em></h1>
            <p class="page-sub">${escapeHtml(subtitle)}</p>
          </div>
          <div class="head-actions">
            <span class="head-note"><strong>${state.versions.length}</strong> версий<br><strong>${state.java.length}</strong> Java найдено</span>
            <button class="btn" data-action="account">${icon('user')}Профиль</button>
            <button class="btn btn-primary" data-action="play" ${version ? '' : 'disabled'}>${icon('play')}${running ? 'Открыть игру' : 'Играть'}</button>
          </div>
        </div>

        ${version ? heroHtml(version) : emptyHeroHtml()}

        ${state.versions.length ? `
          <div class="home-bottom">
            <div class="collection-head">
              <div class="eyebrow"><span class="sep"></span>КОЛЛЕКЦИЯ</div>
              <h2>Быстрый доступ</h2>
              <p>Профили, которые чаще всего под рукой.</p>
              <button class="text-link" data-action="navigate" data-page="versions">Все версии ${icon('arrowRight')}</button>
            </div>
            <div class="collection-grid">
              ${recent.map((item, index) => miniVersionHtml(item, index)).join('')}
              ${recent.length < 3 && state.versions.length < 3 ? miniInstallHtml() : ''}
            </div>
          </div>
        ` : `
          <div class="empty-library" style="margin-top:18px">
            <h3>Пока здесь тихо</h3>
            <p>Установите официальный клиент Minecraft — библиотека, Java и моды подхватятся автоматически.</p>
            <button class="btn btn-primary" data-action="install-modal">${icon('download')}Установить версию</button>
          </div>
        `}
      </div>
    `;
  }

  function plural(count, one, few, many) {
    const value = Math.abs(count) % 100;
    const last = value % 10;
    if (value > 10 && value < 20) return many;
    if (last === 1) return one;
    if (last >= 2 && last <= 4) return few;
    return many;
  }

  function heroHtml(version) {
    const health = versionHealth(version);
    const info = loaderInfo(version.loader);
    const javaMajor = version.javaVersion || version.requiredJava || '—';
    const running = state.launch.running;
    const series = String((hashSeed(version.key) % 3) + 1).padStart(2, '0');

    return `
      <div class="home-grid">
        <section class="hero-card">
          <div class="hero-bg" style="background-image:url('${thumbnailFor(version.key)}')"></div>
          <div class="hero-tint"></div>
          <div class="hero-top">
            <div class="hero-top-left">
              <span class="hero-badge ${health.ok ? 'accent' : ''}">${icon(health.ok ? 'zap' : 'alert')}${escapeHtml(health.text)}</span>
              <span class="hero-badge">${icon('layers')}${escapeHtml(info.label)} · ${escapeHtml(version.base)}</span>
            </div>
            <span class="hero-edition">Ember Launcher · Local Edition</span>
          </div>
          <span class="hero-side-label">Sunset Series · ${series}</span>
          <div class="hero-content">
            <div class="hero-label">Выбранный профиль</div>
            <div class="hero-title-row">
              <h2 class="hero-title">${escapeHtml(version.base)}</h2>
              ${version.custom ? `<span class="hero-loader">${escapeHtml(info.short)}</span>` : ''}
            </div>
            <p class="hero-sub">${escapeHtml(heroSubtitle(version))}</p>
            <div class="hero-meta">
              ${metaItem('java', `Java ${javaMajor}`)}
              <span class="hero-meta-sep"></span>
              ${metaItem('chip', `${state.config.ram} ГБ RAM`)}
              <span class="hero-meta-sep"></span>
              ${metaItem('puzzle', `${activeMods().length} ${plural(activeMods().length, 'мод', 'мода', 'модов')}`)}
              <span class="hero-meta-sep"></span>
              ${metaItem('clock', version.custom ? `Запуск ${relativeDate(state.config.lastPlayedAt)}` : `${state.worlds} ${plural(state.worlds, 'мир', 'мира', 'миров')}`)}
            </div>
            <div class="hero-actions">
              <button class="play-btn" data-action="play">${icon('play')}${running ? 'ОТКРЫТЬ ИГРУ' : 'ИГРАТЬ'}</button>
              <button class="version-pill" data-action="open-picker" aria-haspopup="listbox">
                <span class="vp-copy"><small>Профиль</small><span>${escapeHtml(version.folder)}</span></span>
                ${icon('chevronDown', 'chev')}
              </button>
              <button class="round-btn" data-action="open-folder" data-kind="versions" title="Открыть папку версий" aria-label="Открыть папку версий">${icon('folder')}</button>
            </div>
          </div>
        </section>

        <aside class="home-side">
          <div class="side-card status-card">
            <div class="status-top">
              <span class="avatar avatar-sm" data-avatar="${escapeAttr(state.config.nickname)}"></span>
              <div class="status-copy">
                <strong>${escapeHtml(state.config.nickname)}</strong>
                <small><i class="status-dot ${state.online ? '' : 'is-off'}"></i>Локальный профиль</small>
              </div>
              <button class="status-edit" data-action="account" aria-label="Изменить профиль">${icon('edit')}</button>
            </div>
            <div class="status-stats">
              <div class="status-stat"><b>${Number(state.config.launches) || 0}</b><span>Запусков</span></div>
              <div class="status-stat"><b>${formatPlaytime(state.config.playtimeMs)}</b><span>В игре</span></div>
              <div class="status-stat"><b>${state.worlds}</b><span>Миров</span></div>
            </div>
          </div>

          <div class="side-card news-card" role="button" tabindex="0" data-action="open-news">
            <div class="news-bg" style="background-image:url('${IMAGES.jungle}')"></div>
            <div class="news-shade"></div>
            <div class="news-content">
              <div class="news-top">
                <span class="news-tag"><i class="dot"></i>Журнал · выпуск 03</span>
                <span class="news-index">03 / 03</span>
              </div>
              <div class="news-bottom">
                <h3>Тихий собор</h3>
                <p>Три горизонта, которые собрал Ember. История света, камня и листвы.</p>
              </div>
            </div>
            <span class="news-arrow">${icon('arrowUpRight')}</span>
          </div>

          <div class="side-card last-card" role="button" tabindex="0" data-action="resume-last">
            <div class="last-art" style="background-image:url('${thumbnailFor(state.config.lastVersionPlayed || version.key)}')"></div>
            <div class="last-copy">
              <small>Продолжить</small>
              <strong>${escapeHtml((getVersion(state.config.lastVersionPlayed) || version).base)}</strong>
              <span>${escapeHtml(relativeDate(state.config.lastPlayedAt))}</span>
            </div>
            <span class="last-go">${icon('arrowRight')}</span>
          </div>
        </aside>
      </div>
    `;
  }

  function emptyHeroHtml() {
    return `
      <div class="home-grid">
        <section class="hero-card">
          <div class="hero-bg" style="background-image:url('${IMAGES.cliffs}')"></div>
          <div class="hero-tint"></div>
          <div class="hero-top">
            <div class="hero-top-left">
              <span class="hero-badge">${icon('sparkles')}Новый горизонт</span>
              <span class="hero-badge accent">${icon('download')}Библиотека пуста</span>
            </div>
            <span class="hero-edition">Ember Launcher · Local Edition</span>
          </div>
          <div class="hero-content">
            <div class="hero-label">Первый запуск</div>
            <div class="hero-title-row"><h2 class="hero-title">Начни с горизонта</h2></div>
            <p class="hero-sub">Установите официальную версию Minecraft — Ember сам подберёт Java, память и подготовит клиент к первому запуску.</p>
            <div class="hero-actions">
              <button class="play-btn" data-action="install-modal">${icon('download')}УСТАНОВИТЬ</button>
              <button class="version-pill" data-action="navigate" data-page="settings">
                <span class="vp-copy"><small>Проверить</small><span>Настройки Java</span></span>
                ${icon('chevronDown', 'chev')}
              </button>
            </div>
          </div>
        </section>
        <aside class="home-side">
          <div class="side-card status-card">
            <div class="status-top">
              <span class="avatar avatar-sm" data-avatar="${escapeAttr(state.config.nickname)}"></span>
              <div class="status-copy"><strong>${escapeHtml(state.config.nickname)}</strong><small><i class="status-dot ${state.online ? '' : 'is-off'}"></i>Локальный профиль</small></div>
              <button class="status-edit" data-action="account" aria-label="Изменить профиль">${icon('edit')}</button>
            </div>
            <div class="status-stats">
              <div class="status-stat"><b>0</b><span>Запусков</span></div>
              <div class="status-stat"><b>0 мин</b><span>В игре</span></div>
              <div class="status-stat"><b>${state.worlds}</b><span>Миров</span></div>
            </div>
          </div>
          <div class="side-card news-card" role="button" tabindex="0" data-action="open-news">
            <div class="news-bg" style="background-image:url('${IMAGES.jungle}')"></div>
            <div class="news-shade"></div>
            <div class="news-content">
              <div class="news-top"><span class="news-tag"><i class="dot"></i>Журнал · выпуск 01</span><span class="news-index">01 / 03</span></div>
              <div class="news-bottom"><h3>Первый свет</h3><p>Как подготовить клиент и не потеряться в настройках.</p></div>
            </div>
            <span class="news-arrow">${icon('arrowUpRight')}</span>
          </div>
        </aside>
      </div>
    `;
  }

  function miniVersionHtml(version, index) {
    const active = version.key === state.selected;
    const health = versionHealth(version);
    const info = loaderInfo(version.loader);
    return `
      <button class="mini-version ${active ? 'is-active' : ''}" data-action="select-version" data-key="${escapeAttr(version.key)}">
        <span class="mini-top">
          ${versionChip(version)}
          <span class="mini-active" ${active ? '' : 'style="color:var(--muted-2)"'}>${active ? '<i class="dot"></i>ВЫБРАНА' : escapeHtml(info.short)}</span>
        </span>
        <span class="mini-main"><b>${escapeHtml(version.base)}</b><span>${escapeHtml(version.custom ? version.folder : 'release')}</span></span>
        <span class="mini-bottom">
          <span ${health.error ? 'style="color:#ffb3b3"' : ''}>${escapeHtml(health.ok ? `${activeMods().length} модов · ${state.config.ram} ГБ` : health.text)}</span>
          <span class="mini-arrow">${icon('arrowRight')}</span>
        </span>
      </button>
    `;
  }

  function miniInstallHtml() {
    return `
      <button class="mini-version" data-action="install-modal">
        <span class="mini-top"><span class="chip chip-custom"><i class="dot"></i>Новая</span><span class="mini-active" style="color:var(--muted-2)">MOJANG</span></span>
        <span class="mini-main"><b style="font-size:15px;letter-spacing:-.02em">Установить</b><span>версию</span></span>
        <span class="mini-bottom"><span>Официальный клиент</span><span class="mini-arrow">${icon('plus')}</span></span>
      </button>
    `;
  }

  /* ============================================================
     Versions page
     ============================================================ */

  function filteredVersions() {
    const query = state.filters.versionQuery.trim().toLowerCase();
    return state.versions.filter(version => {
      if (state.filters.versions === 'vanilla' && version.loader !== 'vanilla') return false;
      if (state.filters.versions === 'modded' && version.loader === 'vanilla') return false;
      if (query) {
        const haystack = `${version.key} ${version.base} ${version.folder} ${version.loader}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }

  function versionsHtml() {
    const filtered = filteredVersions();
    const total = state.versions.length;
    const vanillaCount = state.versions.filter(version => version.loader === 'vanilla').length;
    const moddedCount = total - vanillaCount;

    return `
      <div class="page">
        <div class="page-head">
          <div class="page-head-copy">
            <div class="eyebrow"><span class="sep"></span>БИБЛИОТЕКА<span class="date">${total} ${plural(total, 'ПРОФИЛЬ', 'ПРОФИЛЯ', 'ПРОФИЛЕЙ')}</span></div>
            <h1>Библиотека <em>версий</em></h1>
            <p class="page-sub">Официальные клиенты и сборки на Fabric, Forge, Quilt и NeoForge. Выберите профиль и запускайте.</p>
          </div>
          <div class="head-actions">
            <button class="btn" data-action="refresh">${icon('refresh')}Обновить</button>
            <button class="btn btn-primary" data-action="install-modal">${icon('download')}Установить версию</button>
          </div>
        </div>

        ${total === 0 ? `
          <div class="empty-library">
            <h3>Библиотека пуста</h3>
            <p>Скачайте официальную версию Minecraft. Ember загрузит клиент, а библиотеки и ресурсы докачаются при первом запуске.</p>
            <button class="btn btn-primary" data-action="install-modal">${icon('download')}Открыть каталог версий</button>
          </div>
        ` : `
          <div class="versions-toolbar">
            <div class="filter-tabs" role="tablist">
              <button class="filter-tab ${state.filters.versions === 'all' ? 'is-active' : ''}" data-action="version-filter" data-filter="all">Все<span>${total}</span></button>
              <button class="filter-tab ${state.filters.versions === 'vanilla' ? 'is-active' : ''}" data-action="version-filter" data-filter="vanilla">Ванильные<span>${vanillaCount}</span></button>
              <button class="filter-tab ${state.filters.versions === 'modded' ? 'is-active' : ''}" data-action="version-filter" data-filter="modded">Сборки<span>${moddedCount}</span></button>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="results-count" id="versions-found">${filtered.length} из ${total}</span>
              <label class="search-box">
                ${icon('search')}
                <input id="version-search" type="search" placeholder="Найти версию" value="${escapeAttr(state.filters.versionQuery)}" autocomplete="off" spellcheck="false" />
              </label>
            </div>
          </div>
          <div class="versions-grid" id="versions-grid">
            ${versionCardsHtml(filtered)}
          </div>
        `}
      </div>
    `;
  }

  function versionCardsHtml(filtered) {
    const cards = filtered.map((version, index) => versionCardHtml(version, index)).join('');
    const emptySearch = filtered.length === 0
      ? `<div class="empty-library" style="grid-column:1/-1;padding:32px"><h3>Ничего не найдено</h3><p>Попробуйте другой запрос или сбросьте фильтр.</p></div>`
      : '';
    return `${emptySearch}${cards}${addVersionCardHtml()}`;
  }

  function addVersionCardHtml() {
    return `
      <button class="add-version-card" data-action="install-modal">
        <span class="add-icon">${icon('plus')}</span>
        <b>Установить версию</b>
        <span>Каталог Mojang</span>
      </button>
    `;
  }

  function versionCardHtml(version, index) {
    const active = version.key === state.selected;
    const health = versionHealth(version);
    const info = loaderInfo(version.loader);
    return `
      <article class="version-card ${active ? 'is-active' : ''}" style="--i:${index}" role="button" tabindex="0" data-action="select-version" data-key="${escapeAttr(version.key)}">
        <div class="version-card-bg" style="background-image:url('${thumbnailFor(version.key)}')"></div>
        <div class="version-card-shade"></div>
        <div class="version-card-top">
          ${versionChip(version)}
          <button class="version-launch" data-action="play" data-key="${escapeAttr(version.key)}" aria-label="Запустить ${escapeAttr(version.base)}">${icon('play')}</button>
        </div>
        <div class="version-card-body">
          <h3>${escapeHtml(version.base)}</h3>
          <p><span>${escapeHtml(version.folder)}</span><i class="dot"></i><span>Java ${version.javaVersion || version.requiredJava}</span></p>
          <div class="version-card-foot">
            <span>${icon('clock')}${formatDate(version.releaseTime)}</span>
            <span class="${active ? 'active-flag' : ''}" ${health.error ? 'style="color:#ffb3b3"' : ''}>${escapeHtml(active ? 'АКТИВНА' : health.ok ? 'ГОТОВА' : health.text)}</span>
          </div>
        </div>
      </article>
    `;
  }

  function updateVersionsGrid() {
    const grid = $('#versions-grid');
    if (!grid) return;
    const filtered = filteredVersions();
    grid.innerHTML = versionCardsHtml(filtered);
    const found = $('#versions-found');
    if (found) found.textContent = `${filtered.length} из ${state.versions.length}`;
    hydrateAvatars(grid);
  }

  /* ============================================================
     Mods page
     ============================================================ */

  function filteredMods() {
    const query = state.filters.modsQuery.trim().toLowerCase();
    if (!query) return state.mods;
    return state.mods.filter(mod => `${mod.name} ${mod.filename}`.toLowerCase().includes(query));
  }

  function modsHtml() {
    const mods = filteredMods();
    const enabled = activeMods().length;
    const total = state.mods.length;
    const root = state.config.root || '';

    return `
      <div class="page">
        <div class="page-head">
          <div class="page-head-copy">
            <div class="eyebrow"><span class="sep"></span>МОДИФИКАЦИИ<span class="date">${enabled} АКТИВНО · ${total} ВСЕГО</span></div>
            <h1>Моды и <em>сборки</em></h1>
            <p class="page-sub">Управляйте содержимым папки mods без перезапуска лаунчера. Отключённые моды остаются на месте.</p>
          </div>
          <div class="head-actions">
            <button class="btn" data-action="refresh">${icon('refresh')}Обновить</button>
            <button class="btn" data-action="open-folder" data-kind="mods">${icon('folder')}Открыть папку</button>
          </div>
        </div>

        <div class="mods-layout">
          <div class="mods-main">
            ${total === 0 ? modsEmptyHtml() : `
              <div class="mods-toolbar">
                <div class="mods-counts" id="mods-counts">
                  <span><b>${enabled}</b> включено</span>
                  <span style="opacity:.4">·</span>
                  <span><b>${total}</b> всего</span>
                </div>
                <label class="search-box">
                  ${icon('search')}
                  <input id="mods-search" type="search" placeholder="Найти мод" value="${escapeAttr(state.filters.modsQuery)}" autocomplete="off" spellcheck="false" />
                </label>
              </div>
              <div class="mods-grid" id="mods-grid">${modCardsHtml(mods)}</div>
            `}
          </div>

          <aside class="mods-aside">
            <div class="aside-art">
              <div class="aside-art-content">
                <div class="eyebrow"><span class="sep"></span>КУРАТОР</div>
                <h3>Сад модов</h3>
                <p>Держите только совместимые моды — и мир ответит стабильностью.</p>
              </div>
            </div>

            <div class="aside-card">
              <h4>Как это работает</h4>
              <div class="guide-step"><span class="guide-num">1</span><p>Скачайте <b>.jar</b> под вашу версию и загрузчик.</p></div>
              <div class="guide-step"><span class="guide-num">2</span><p>Положите файл в папку <b>mods</b>.</p></div>
              <div class="guide-step"><span class="guide-num">3</span><p>Включите или отключите мод переключателем — файл останется на месте.</p></div>
              <div class="folder-path">
                <span title="${escapeAttr(root)}">${escapeHtml(root)}\\mods</span>
                <button data-action="copy-path" data-path="${escapeAttr(root)}\\mods" title="Скопировать путь" aria-label="Скопировать путь">${icon('copy')}</button>
                <button data-action="open-folder" data-kind="mods" title="Открыть папку" aria-label="Открыть папку">${icon('folder')}</button>
              </div>
              <div class="warning-note">${icon('alert')}<p>Моды должны совпадать с версией игры и типом загрузчика. Forge-моды не запустятся на Fabric.</p></div>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  function modsEmptyHtml() {
    return `
      <div class="mods-empty">
        <div class="empty-block">${icon('puzzle')}</div>
        <h3>Папка модов пуста</h3>
        <p>Скачайте моды для выбранной версии и положите их в папку mods. Ember увидит их сразу.</p>
        <button class="btn" data-action="open-folder" data-kind="mods">${icon('folder')}Открыть папку mods</button>
      </div>
    `;
  }

  function modCardsHtml(mods) {
    if (!mods.length) {
      return `<div class="mods-empty" style="grid-column:1/-1"><div class="empty-block">${icon('search')}</div><h3>Ничего не найдено</h3><p>Попробуйте другой запрос — поиск идёт по имени и файлу мода.</p></div>`;
    }
    return mods.map(mod => {
      const busy = state.busyMods.has(mod.file);
      const hue = hashSeed(mod.name) % 360;
      const hue2 = (hue + 42) % 360;
      const letter = (mod.name.match(/[A-Za-zА-Яа-я0-9]/) || ['E'])[0].toUpperCase();
      return `
        <button class="mod-card ${mod.enabled ? '' : 'is-off'}" data-action="toggle-mod" data-file="${escapeAttr(mod.file)}" data-enabled="${mod.enabled ? '0' : '1'}" ${busy ? 'disabled' : ''}>
          <span class="mod-icon" style="background:linear-gradient(145deg,hsl(${hue} 62% 43%),hsl(${hue2} 58% 23%))">${escapeHtml(letter)}</span>
          <span class="mod-copy">
            <strong>${escapeHtml(mod.name)}</strong>
            <span><em>${escapeHtml(mod.filename)}</em></span>
            <span>${formatBytes(mod.size)}${busy ? ' · обновляем…' : ''}</span>
          </span>
          <span class="mod-toggle"><span class="switch ${mod.enabled ? 'is-on' : ''}"></span></span>
        </button>
      `;
    }).join('');
  }

  function updateModsGrid() {
    const grid = $('#mods-grid');
    if (!grid) return;
    grid.innerHTML = modCardsHtml(filteredMods());
    const counts = $('#mods-counts');
    if (counts) {
      counts.innerHTML = `<span><b>${activeMods().length}</b> включено</span><span style="opacity:.4">·</span><span><b>${state.mods.length}</b> всего</span>`;
    }
  }

  /* ============================================================
     Settings page
     ============================================================ */

  function maxRamAllowed() {
    const total = Number(state.system.totalMemGb) || 8;
    return Math.max(2, Math.min(32, total - 1));
  }

  function displayJava() {
    const config = state.config;
    if (config.javaPath) {
      const found = state.java.find(meta => meta.path === config.javaPath);
      if (found) return found;
    }
    const version = selectedVersion();
    const required = version ? version.requiredJava : 0;
    if (required) {
      const ok = state.java.filter(meta => meta.major >= required).sort((a, b) => a.major - b.major);
      if (ok.length) return ok[0];
    }
    return state.java.slice().sort((a, b) => b.major - a.major)[0] || null;
  }

  function resolutionOptions() {
    const presets = [
      [1280, 720, 'HD'],
      [1600, 900, 'HD+'],
      [1920, 1080, 'Full HD'],
      [2560, 1440, 'QHD'],
      [3840, 2160, '4K'],
    ];
    const current = state.config.resolution || { width: 1280, height: 720 };
    if (!presets.some(([w, h]) => w === current.width && h === current.height)) {
      presets.push([current.width, current.height, 'Своё']);
    }
    return presets;
  }

  function settingsSwitchRow(title, description, key, enabled) {
    return `
      <div class="switch-row">
        <div><b>${escapeHtml(title)}</b><span>${escapeHtml(description)}</span></div>
        <button class="switch ${enabled ? 'is-on' : ''}" role="switch" aria-checked="${enabled ? 'true' : 'false'}" aria-label="${escapeAttr(title)}" data-action="toggle-setting" data-key="${escapeAttr(key)}"></button>
      </div>
    `;
  }

  function settingsHtml() {
    const config = state.config;
    const maxRam = Math.max(maxRamAllowed(), Number(config.ram) || 1);
    const ram = clamp(Number(config.ram) || 4, 1, maxRam);
    const fill = maxRam > 1 ? Math.round(((ram - 1) / (maxRam - 1)) * 100) : 0;
    const java = displayJava();
    const nick = config.nickname || 'Steve';
    const uuid = state.uuidCache[nick] || '…';
    const resolution = config.resolution || { width: 1280, height: 720 };

    const javaOptions = [
      `<option value="">Автовыбор · Java ${java ? java.major : '—'}</option>`,
      ...state.java.map(meta => `<option value="${escapeAttr(meta.path)}" ${meta.path === config.javaPath ? 'selected' : ''}>Java ${meta.major} · ${escapeHtml(meta.version)} · ${escapeHtml(meta.vendor)}</option>`),
    ].join('');

    const resOptions = resolutionOptions().map(([w, h, tag]) =>
      `<option value="${w}x${h}" ${w === resolution.width && h === resolution.height ? 'selected' : ''}>${w} × ${h}${tag ? ` · ${tag}` : ''}</option>`
    ).join('');

    return `
      <div class="page">
        <div class="page-head">
          <div class="page-head-copy">
            <div class="eyebrow"><span class="sep"></span>КОНФИГУРАЦИЯ<span class="date">${escapeHtml(state.system.cpus || '')}</span></div>
            <h1>Настройки <em>запуска</em></h1>
            <p class="page-sub">Память, Java и параметры окна. Изменения сохраняются автоматически.</p>
          </div>
          <div class="head-actions">
            <span class="saved-indicator" id="settings-saved">${icon('check')}Сохранено</span>
            <button class="btn" data-action="open-folder" data-kind="root">${icon('folder')}Папка игры</button>
          </div>
        </div>

        <div class="settings-layout">
          <div class="settings-col">
            <section class="settings-card">
              <div class="settings-card-head">
                <div><h3>Оперативная память</h3><p>Сколько RAM выделить Java для Minecraft</p></div>
                <span class="settings-icon">${icon('chip')}</span>
              </div>
              <div class="settings-body">
                <div class="memory-value"><b id="ram-value">${ram}</b><span>ГБ из ${state.system.totalMemGb || '—'} ГБ</span></div>
                <div class="range-row">
                  <input id="ram-range" type="range" min="1" max="${maxRam}" step="1" value="${ram}" style="--fill:${fill}%" aria-label="Память для игры" />
                </div>
                <div class="range-info"><span>1 ГБ</span><span>Максимум ${maxRam} ГБ</span></div>
                <div class="memory-hint">${icon('info')}<span>Для ванильных версий хватает 2–4 ГБ. Для тяжёлых сборок с модами выделите 6–8 ГБ.</span></div>
              </div>
            </section>

            <section class="settings-card">
              <div class="settings-card-head">
                <div><h3>Java</h3><p>Среда выполнения для выбранной версии</p></div>
                <span class="settings-icon">${icon('java')}</span>
              </div>
              <div class="settings-body">
                <div class="java-status ${java ? '' : 'is-bad'}">
                  <div class="java-badge">${icon('java')}</div>
                  <div class="java-status-copy">
                    <b>${java ? `Java ${java.major} · ${escapeHtml(java.vendor)}` : 'Java не найдена'}</b>
                    <span title="${escapeAttr(java ? java.path : '')}">${escapeHtml(java ? java.path : 'Установите Java или укажите путь вручную')}</span>
                  </div>
                  <span class="java-version-chip">${state.java.length} найдено</span>
                </div>
                <div class="setting-row">
                  <div class="setting-copy"><b>Исполняемый файл</b><span>Автовыбор подбирает Java под версию игры</span></div>
                  <div class="setting-control">
                    <div class="select-wrap"><select id="java-select" aria-label="Java">${javaOptions}</select></div>
                    <button class="mini-btn accent" data-action="pick-java">Указать путь</button>
                  </div>
                </div>
              </div>
            </section>

            <section class="settings-card">
              <div class="settings-card-head">
                <div><h3>Игра</h3><p>Папка, окно и поведение при запуске</p></div>
                <span class="settings-icon">${icon('monitor')}</span>
              </div>
              <div class="settings-body">
                <div class="setting-row">
                  <div class="setting-copy"><b>Папка игры</b><span>Версии, моды, миры и ресурсы</span></div>
                  <div class="setting-control">
                    <span class="path-chip" title="${escapeAttr(config.root)}">${escapeHtml(config.root)}</span>
                    <button class="mini-btn" data-action="pick-folder">Изменить</button>
                  </div>
                </div>
                <div class="setting-row">
                  <div class="setting-copy"><b>Разрешение окна</b><span>Применяется при следующем запуске</span></div>
                  <div class="setting-control">
                    <div class="select-wrap"><select id="resolution-select" aria-label="Разрешение">${resOptions}</select></div>
                  </div>
                </div>
                ${settingsSwitchRow('Полноэкранный режим', 'Запускать игру на весь экран', 'fullscreen', Boolean(config.fullscreen))}
                ${settingsSwitchRow('Скрывать лаунчер', 'Сворачивать окно после старта Minecraft', 'closeOnLaunch', Boolean(config.closeOnLaunch))}
              </div>
            </section>
          </div>

          <div class="settings-col">
            <section class="settings-card profile-card">
              <div class="profile-top">
                <span class="avatar avatar-lg" data-avatar="${escapeAttr(nick)}"></span>
                <div class="profile-info">
                  <h3>${escapeHtml(nick)}</h3>
                  <p><i class="status-dot ${state.online ? '' : 'is-off'}"></i>Локальный профиль</p>
                </div>
                <button class="icon-btn" data-action="account" aria-label="Изменить профиль">${icon('edit')}</button>
              </div>
              <div class="profile-uuid">
                <span>UUID ПРОФИЛЯ</span>
                <code data-uuid-name="${escapeAttr(nick)}">${escapeHtml(uuid)}</code>
              </div>
            </section>

            <section class="settings-card">
              <div class="settings-card-head">
                <div><h3>Внешний вид</h3><p>Атмосфера лаунчера</p></div>
                <span class="settings-icon">${icon('sparkles')}</span>
              </div>
              <div class="settings-body">
                <div class="bg-thumbs" aria-hidden="true">
                  <span class="bg-thumb is-active" style="background-image:url('${IMAGES.canyon}')"><i>01</i></span>
                  <span class="bg-thumb" style="background-image:url('${IMAGES.cliffs}')"><i>02</i></span>
                  <span class="bg-thumb" style="background-image:url('${IMAGES.jungle}')"><i>03</i></span>
                </div>
                ${settingsSwitchRow('Живой фон', 'Плавное движение и параллакс', 'backgroundMotion', Boolean(config.backgroundMotion))}
                ${settingsSwitchRow('Частицы', 'Тлеющие угли поверх фона', 'particles', Boolean(config.particles))}
              </div>
            </section>

            <section class="settings-card about-card">
              <div class="about-brand">
                <img src="../../assets/icons/icon-64.png" alt="" />
                <div>
                  <b>EMBER LAUNCHER</b>
                  <span>v${escapeHtml(state.appVersion)} · LOCAL EDITION</span>
                </div>
              </div>
              <div class="about-links">
                <button data-action="open-folder" data-kind="launcher">${icon('folder')}Папка лаунчера</button>
                <button data-action="open-folder" data-kind="launcherLogs">${icon('list')}Логи</button>
                <button data-action="open-folder" data-kind="root">${icon('box')}Папка игры</button>
              </div>
              <p style="margin:12px 0 0;font-size:8.5px;line-height:1.5;color:var(--muted-2)">Собрано на Electron ${escapeHtml(state.system.electron || '45')} · Minecraft Launcher Core 3.18 · профиль работает офлайн.</p>
            </section>
          </div>
        </div>
      </div>
    `;
  }

  /* ============================================================
     Modal helpers / account
     ============================================================ */

  function setModal(html) {
    const root = $('#modal-root');
    if (!root) return;
    root.innerHTML = html;
    hydrateAvatars(root);
    updateUuidLabels();
  }

  function closeModal() {
    const root = $('#modal-root');
    if (root) root.innerHTML = '';
    state.modal = null;
  }

  async function uuidFor(name) {
    if (!name || !/^[A-Za-z0-9_]{3,16}$/.test(name)) return '';
    if (state.uuidCache[name]) return state.uuidCache[name];
    try {
      const uuid = await window.ember.accountUuid(name);
      if (uuid) state.uuidCache[name] = uuid;
      return uuid || '';
    } catch {
      return '';
    }
  }

  function updateUuidLabels() {
    $$('[data-uuid-name]').forEach(async node => {
      const name = node.getAttribute('data-uuid-name');
      const uuid = await uuidFor(name);
      if (node.isConnected && node.getAttribute('data-uuid-name') === name) {
        node.textContent = uuid || '—';
      }
    });
  }

  function openAccountModal() {
    closePopover();
    state.modal = 'account';
    const nick = state.config.nickname || 'Steve';
    setModal(`
      <div class="modal-layer" data-action="modal-backdrop">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
          <div class="modal-head">
            <div>
              <h2 id="account-title">Локальный профиль</h2>
              <p>Ник и UUID для офлайн-игры. Вход в Microsoft не требуется.</p>
            </div>
            <button class="modal-close" data-action="close-modal" aria-label="Закрыть">${icon('close')}</button>
          </div>
          <div class="modal-body account-body">
            <span class="avatar avatar-xl" data-avatar="${escapeAttr(nick)}"></span>
            <div class="account-name-field">
              <label for="account-nick">Никнейм</label>
              <input id="account-nick" class="text-input" maxlength="16" value="${escapeAttr(nick)}" autocomplete="off" spellcheck="false" />
              <p class="field-hint">3–16 символов: латиница, цифры и подчёркивание. Так вас увидят в мире.</p>
              <p class="field-error" id="account-error" hidden>Никнейм должен содержать 3–16 символов: латиница, цифры или _</p>
            </div>
            <div class="uuid-row">
              <span>UUID ПРОФИЛЯ</span>
              <code data-uuid-name="${escapeAttr(nick)}">${escapeHtml(state.uuidCache[nick] || '…')}</code>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn" data-action="close-modal">Отмена</button>
            <button class="btn btn-primary" data-action="account-save">${icon('check')}Сохранить</button>
          </div>
        </div>
      </div>
    `);
    const input = $('#account-nick');
    if (input) {
      input.focus({ preventScroll: true });
      input.select();
    }
  }

  function updateAccountPreview() {
    const input = $('#account-nick');
    if (!input) return;
    const sanitized = input.value.replace(/[^A-Za-z0-9_]/g, '').slice(0, 16);
    if (input.value !== sanitized) input.value = sanitized;

    const valid = /^[A-Za-z0-9_]{3,16}$/.test(sanitized);
    const avatar = $('.account-body .avatar');
    if (avatar) {
      avatar.setAttribute('data-avatar', sanitized || 'Steve');
      drawAvatar(avatar);
    }
    const code = $('.account-body .uuid-row code');
    if (code) {
      code.setAttribute('data-uuid-name', sanitized);
      code.textContent = valid ? (state.uuidCache[sanitized] || '…') : '—';
    }
    const error = $('#account-error');
    if (error) error.hidden = true;
    input.classList.remove('is-invalid');
    if (valid) updateUuidLabels();
  }

  async function saveAccount() {
    const input = $('#account-nick');
    if (!input) return;
    const nickname = input.value.trim();
    if (!/^[A-Za-z0-9_]{3,16}$/.test(nickname)) {
      const error = $('#account-error');
      if (error) error.hidden = false;
      input.classList.add('is-invalid');
      input.focus();
      return;
    }
    try {
      await window.ember.saveAccount(nickname);
      state.config.nickname = nickname;
      closeModal();
      render();
      toast('Профиль обновлён', `Ник ${nickname} применён к следующим запускам`, 'success');
    } catch (error) {
      toast('Не удалось сохранить профиль', cleanError(error), 'error');
    }
  }

  /* ============================================================
     Available versions / install modal
     ============================================================ */

  async function loadAvailable(options = {}) {
    if (state.available.loading) return;
    state.available.loading = true;
    state.available.error = null;
    if (state.modal === 'install') renderInstallModal();
    try {
      const data = await window.ember.availableVersions();
      state.available = {
        loaded: true,
        loading: false,
        error: null,
        versions: Array.isArray(data.versions) ? data.versions : [],
        latest: data.latest || null,
      };
    } catch (error) {
      state.available.loading = false;
      state.available.error = cleanError(error);
      if (!options.silent) toast('Каталог недоступен', state.available.error, 'error');
    }
    if (state.modal === 'install') renderInstallModal();
  }

  function openInstallModal() {
    closePopover();
    if (state.install && (state.install.done || state.install.error)) state.install = null;
    state.modal = 'install';
    renderInstallModal();
    if (!state.available.loaded && !state.available.loading) loadAvailable();
  }

  function typeLabel(type) {
    if (type === 'release') return 'Релиз';
    if (type === 'snapshot') return 'Снапшот';
    if (type === 'old_beta') return 'Бета';
    if (type === 'old_alpha') return 'Альфа';
    return type || 'Версия';
  }

  function typeShort(type) {
    if (type === 'release') return 'REL';
    if (type === 'snapshot') return 'SNAP';
    return 'OLD';
  }

  function availableToolbarHtml() {
    const tabs = [
      ['release', 'Релизы'],
      ['snapshot', 'Снапшоты'],
      ['all', 'Все'],
    ];
    return `
      <div class="available-toolbar">
        <div class="filter-tabs" role="tablist">
          ${tabs.map(([value, label]) => `<button class="filter-tab ${state.filters.availableType === value ? 'is-active' : ''}" data-action="available-type" data-type="${value}">${label}</button>`).join('')}
        </div>
        <label class="search-box">
          ${icon('search')}
          <input id="available-search" type="search" placeholder="Поиск по каталогу" value="${escapeAttr(state.filters.availableQuery)}" autocomplete="off" spellcheck="false" />
        </label>
      </div>
    `;
  }

  function filteredAvailable() {
    const query = state.filters.availableQuery.trim().toLowerCase();
    return state.available.versions.filter(version => {
      if (state.filters.availableType !== 'all' && version.type !== state.filters.availableType) return false;
      if (query && !version.id.toLowerCase().includes(query)) return false;
      return true;
    });
  }

  function availableListHtml() {
    if (state.available.loading) {
      return `<div class="modal-loading"><div style="text-align:center"><div class="spinner" style="margin:0 auto 12px"></div><span>Получаем каталог Mojang…</span></div></div>`;
    }
    if (state.available.error) {
      return `
        <div class="install-state">
          <div class="install-state-icon is-error">${icon('alert')}</div>
          <h3>Каталог недоступен</h3>
          <p>${escapeHtml(state.available.error)}</p>
          <div class="install-actions"><button class="btn btn-primary" data-action="retry-available">${icon('refresh')}Повторить</button></div>
        </div>
      `;
    }
    const installed = new Set(state.versions.map(version => version.key));
    const list = filteredAvailable();
    const shown = list.slice(0, 120);
    if (!shown.length) {
      return `<div class="modal-loading"><span>Ничего не найдено. Измените запрос.</span></div>`;
    }
    return shown.map(version => {
      const isInstalled = installed.has(version.id);
      const isLatest = state.available.latest && state.available.latest.release === version.id;
      return `
        <button class="version-row ${isInstalled ? 'is-installed' : ''}" data-action="install-version" data-id="${escapeAttr(version.id)}" data-url="${escapeAttr(version.url)}" ${isInstalled ? 'disabled' : ''}>
          <span class="vr-icon">${icon(isInstalled ? 'check' : version.type === 'release' ? 'box' : 'clock')}</span>
          <span class="vr-copy">
            <b>${escapeHtml(version.id)}${isLatest ? ' <span class="latest-tag">LATEST</span>' : ''}</b>
            <span>${formatDate(version.releaseTime)} · ${typeLabel(version.type)}</span>
          </span>
          <span class="vr-type">${typeShort(version.type)}</span>
          <span class="vr-action ${isInstalled ? 'is-installed' : ''}">${isInstalled ? 'Установлено' : 'Установить'}</span>
        </button>
      `;
    }).join('') + (list.length > shown.length ? `<div class="list-more">Показаны первые ${shown.length} из ${list.length}. Уточните поиск.</div>` : '');
  }

  function installProgressHtml(install) {
    const percent = clamp(Math.round(Number(install.percent) || 0), 0, 100);
    return `
      <div class="install-progress">
        <div class="install-progress-head">
          <span class="spinner"></span>
          <div class="install-progress-copy">
            <b>Установка ${escapeHtml(install.id)}</b>
            <span id="install-label">${escapeHtml(install.label || 'Подготовка…')}</span>
          </div>
          <span class="install-pct" id="install-percent">${percent}%</span>
        </div>
        <div class="progress-track"><div class="progress-fill" id="install-fill" style="width:${percent}%"></div></div>
        <div class="launch-meta">
          <span class="file" id="install-file">${escapeHtml(install.label || 'Подключение к Mojang')}</span>
          <span id="install-bytes">${install.total ? `${formatBytes(install.downloaded || 0)} / ${formatBytes(install.total)}` : 'Mojang CDN'}</span>
        </div>
        <div class="available-note" style="padding:14px 0 0">${icon('shield')}<span>Загружаем официальный клиент и version.json. Библиотеки и ресурсы докачаются при первом запуске. Не закрывайте лаунчер.</span></div>
      </div>
    `;
  }

  function installDoneHtml(install) {
    return `
      <div class="install-state">
        <div class="install-state-icon">${icon('check')}</div>
        <h3>Версия установлена</h3>
        <p><b>${escapeHtml(install.id)}</b> появилась в библиотеке. При первом запуске Ember докачает библиотеки, ассеты и нативы.</p>
        <div class="install-actions">
          <button class="btn" data-action="close-modal">Готово</button>
          <button class="btn btn-primary" data-action="play-installed" data-key="${escapeAttr(install.id)}">${icon('play')}Играть</button>
        </div>
      </div>
    `;
  }

  function installErrorHtml(install) {
    return `
      <div class="install-state">
        <div class="install-state-icon is-error">${icon('alert')}</div>
        <h3>Установка прервана</h3>
        <p>${escapeHtml(install.error || 'Не удалось скачать версию.')}</p>
        <div class="install-actions">
          <button class="btn" data-action="close-modal">Закрыть</button>
          <button class="btn btn-primary" data-action="retry-install">${icon('refresh')}Повторить</button>
        </div>
      </div>
    `;
  }

  function installModalHtml() {
    let body = '';
    let listMode = false;
    if (state.install && !state.install.done && !state.install.error) {
      body = `<div class="modal-body">${installProgressHtml(state.install)}</div>`;
    } else if (state.install && state.install.done) {
      body = `<div class="modal-body">${installDoneHtml(state.install)}</div>`;
    } else if (state.install && state.install.error) {
      body = `<div class="modal-body">${installErrorHtml(state.install)}</div>`;
    } else {
      listMode = true;
      body = `${availableToolbarHtml()}<div class="version-list" id="available-list">${availableListHtml()}</div>
        <div class="available-note">${icon('shield')}<span>Каталог Mojang. Устанавливается официальный клиент; библиотеки и ресурсы подтянутся при первом запуске. Профиль остаётся офлайн.</span></div>`;
    }

    return `
      <div class="modal-layer" data-action="modal-backdrop">
        <div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="install-title">
          <div class="modal-head">
            <div>
              <h2 id="install-title">Установить версию</h2>
              <p>${listMode ? 'Официальные релизы и снапшоты Minecraft Java Edition.' : 'Загрузка из официальных серверов Mojang.'}</p>
            </div>
            <button class="modal-close" data-action="close-modal" aria-label="Закрыть">${icon('close')}</button>
          </div>
          ${body}
        </div>
      </div>
    `;
  }

  function renderInstallModal() {
    if (state.modal !== 'install') return;
    setModal(installModalHtml());
  }

  function updateAvailableList() {
    const list = $('#available-list');
    if (!list) return;
    list.innerHTML = availableListHtml();
  }

  async function installVersion(id, url) {
    if (state.install && !state.install.done && !state.install.error) return;
    state.install = { id, url, percent: 0, label: 'Получение данных', done: false, error: null, downloaded: 0, total: 0 };
    renderInstallModal();
    try {
      const result = await window.ember.installVersion({ id, url });
      state.install.done = true;
      state.install.percent = 100;
      state.install.label = 'Готово';
      const key = (result && result.version && result.version.key) || id;
      state.selected = key;
      savePatch({ lastVersionKey: key }, { silent: true });
      toast('Версия установлена', id, 'success');
      if (state.modal === 'install') renderInstallModal();
      render();
    } catch (error) {
      state.install.error = cleanError(error);
      if (state.modal === 'install') renderInstallModal();
      toast('Ошибка установки', state.install.error, 'error');
    }
  }

  function handleInstallEvent(payload) {
    if (!payload || !state.install || payload.id !== state.install.id) return;
    if (state.install.done || state.install.error) return;
    if (payload.label) state.install.label = payload.label;
    if (payload.percent != null) state.install.percent = payload.percent;
    if (payload.downloaded != null) state.install.downloaded = payload.downloaded;
    if (payload.total != null) state.install.total = payload.total;
    if (payload.phase === 'done') state.install.label = 'Завершаем установку';
    updateInstallProgressDom();
  }

  function updateInstallProgressDom() {
    const install = state.install;
    if (!install) return;
    const percent = clamp(Math.round(Number(install.percent) || 0), 0, 100);
    const percentNode = $('#install-percent');
    if (percentNode) percentNode.textContent = `${percent}%`;
    const fill = $('#install-fill');
    if (fill) fill.style.width = `${percent}%`;
    const label = $('#install-label');
    if (label) label.textContent = install.label || 'Подготовка…';
    const file = $('#install-file');
    if (file) file.textContent = install.label || 'Подключение к Mojang';
    const bytes = $('#install-bytes');
    if (bytes) bytes.textContent = install.total ? `${formatBytes(install.downloaded || 0)} / ${formatBytes(install.total)}` : 'Mojang CDN';
  }

  /* ============================================================
     Journal / version picker / misc
     ============================================================ */

  function openJournalModal() {
    closePopover();
    state.modal = 'journal';
    const cards = [
      { image: IMAGES.canyon, index: '01', tag: 'Каньон', title: 'Медный закат', text: 'Солнце падает за layered-скалы, а свет остаётся на кромке камня. Открывает серию Sunset.' },
      { image: IMAGES.cliffs, index: '02', tag: 'Утёсы', title: 'Край света', text: 'Тёплый туман над водой и тишина на горизонте. Второй горизонт коллекции Ember.' },
      { image: IMAGES.jungle, index: '03', tag: 'Собор', title: 'Тихий собор', text: 'Листва смыкается над каменными арками. Место, где моды и ваниль звучат одинаково.' },
    ];
    setModal(`
      <div class="modal-layer" data-action="modal-backdrop">
        <div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="journal-title">
          <div class="modal-head">
            <div>
              <h2 id="journal-title">Журнал Ember</h2>
              <p>Три горизонта одной коллекции. Свет, камень и листва — атмосфера лаунчера.</p>
            </div>
            <button class="modal-close" data-action="close-modal" aria-label="Закрыть">${icon('close')}</button>
          </div>
          <div class="modal-body">
            <div class="journal-grid">
              ${cards.map(card => `
                <article class="journal-card" style="background-image:url('${card.image}')">
                  <div class="journal-shade"></div>
                  <div class="journal-content">
                    <div class="journal-top"><span class="journal-tag">${escapeHtml(card.tag)}</span><span class="journal-index">${card.index} / 03</span></div>
                    <div><h3>${escapeHtml(card.title)}</h3><p>${escapeHtml(card.text)}</p></div>
                  </div>
                </article>
              `).join('')}
            </div>
            <div class="available-note" style="padding:16px 0 0">${icon('sparkles')}<span>Изображения из личной коллекции используются как фон лаунчера: герой, карточки версий, журнал и экран запуска.</span></div>
          </div>
          <div class="modal-foot"><button class="btn btn-primary" data-action="close-modal">Закрыть журнал</button></div>
        </div>
      </div>
    `);
  }

  function closePopover() {
    const popover = $('.popover');
    if (popover) popover.remove();
  }

  function toggleVersionPicker(anchor) {
    if ($('.popover')) {
      closePopover();
      return;
    }
    if (!state.versions.length) {
      toast('Нет версий', 'Сначала установите Minecraft в библиотеку', 'info');
      return;
    }
    const items = state.versions.map(version => `
      <button class="popover-item ${version.key === state.selected ? 'is-current' : ''}" data-action="picker-select" data-key="${escapeAttr(version.key)}" role="option" aria-selected="${version.key === state.selected ? 'true' : 'false'}">
        <span class="pi-dot"></span>
        <span class="pi-copy"><b>${escapeHtml(version.folder)}</b><span>${escapeHtml(version.base)} · ${escapeHtml(loaderInfo(version.loader).label)}</span></span>
        ${version.key === state.selected ? `<span class="pi-check">${icon('check')}</span>` : ''}
      </button>
    `).join('');
    document.body.insertAdjacentHTML('beforeend', `
      <div class="popover" role="listbox" aria-label="Выбор версии">
        <div class="popover-head"><span>Библиотека · ${state.versions.length}</span><span>${icon('layers')}</span></div>
        <div class="popover-list">${items}</div>
      </div>
    `);
    const popover = $('.popover');
    if (!popover) return;
    const rect = anchor.getBoundingClientRect();
    const width = popover.offsetWidth || 292;
    const height = popover.offsetHeight || 300;
    let left = rect.left;
    let top = rect.bottom + 8;
    if (top + height > window.innerHeight - 12) top = rect.top - height - 8;
    left = clamp(left, 12, window.innerWidth - width - 12);
    top = clamp(top, 12, window.innerHeight - height - 12);
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      toast('Путь скопирован', text, 'success');
    } catch {
      toast('Не удалось скопировать', text, 'error');
    }
  }

  /* ============================================================
     Launch overlay
     ============================================================ */

  function idFor(key) {
    return String(key || '').replace(/[^A-Za-z0-9]/g, '');
  }

  async function play(key) {
    const version = getVersion(key || state.selected) || selectedVersion();
    if (!version) {
      toast('Нет версий', 'Сначала установите Minecraft', 'info');
      return;
    }
    state.selected = version.key;
    state.config.lastVersionKey = version.key;
    savePatch({ lastVersionKey: version.key }, { silent: true });

    if (state.launch.running) {
      state.launch.open = true;
      renderLaunch();
      return;
    }

    state.launch = {
      open: true,
      demo: false,
      running: true,
      started: false,
      closed: false,
      error: null,
      errorCode: null,
      key: version.key,
      percent: 2,
      stage: 'Подготовка профиля',
      file: '',
      logs: [`Запуск ${version.base} · ${loaderInfo(version.loader).label}`],
      version,
    };
    renderLaunch();
    renderShell();

    try {
      const result = await window.ember.launch({ key: version.key });
      if (result && !result.ok) {
        state.launch.error = result.error || 'Не удалось запустить игру';
        state.launch.errorCode = result.code || null;
        state.launch.stage = 'Ошибка запуска';
        state.launch.running = false;
        state.launch.logs.push(state.launch.error);
        updateLaunchOverlay();
        renderShell();
      }
    } catch (error) {
      state.launch.error = cleanError(error);
      state.launch.stage = 'Ошибка запуска';
      state.launch.running = false;
      state.launch.logs.push(state.launch.error);
      updateLaunchOverlay();
      renderShell();
    }
  }

  function resetLaunchState() {
    state.launch = {
      open: false,
      demo: false,
      running: false,
      started: false,
      closed: false,
      error: null,
      errorCode: null,
      key: null,
      percent: 0,
      stage: '',
      file: '',
      logs: [],
      version: null,
    };
  }

  function hideLaunchOverlay() {
    state.launch.open = false;
    if (!state.launch.running) resetLaunchState();
    renderLaunch();
    renderShell();
  }

  async function stopGame() {
    if (state.launch.demo) {
      hideLaunchOverlay();
      return;
    }
    state.launch.stage = 'Завершение игры';
    state.launch.logs.push('Отправляем сигнал завершения…');
    updateLaunchOverlay();
    try {
      await window.ember.kill();
    } catch (error) {
      toast('Не удалось остановить игру', cleanError(error), 'error');
    }
  }

  function renderLaunch() {
    const root = $('#launch-root');
    if (!root) return;
    if (!state.launch.open) {
      root.innerHTML = '';
      return;
    }
    if (root.querySelector('.launch-layer')) {
      updateLaunchOverlay();
      return;
    }
    const launch = state.launch;
    const version = launch.version || getVersion(launch.key) || selectedVersion();
    const info = version ? loaderInfo(version.loader) : LOADERS.custom;
    const java = version ? (version.javaVersion || version.requiredJava || '—') : '—';

    root.innerHTML = `
      <div class="launch-layer" id="launch-layer">
        <div class="launch-panel" role="dialog" aria-modal="true" aria-labelledby="launch-title">
          <div class="launch-art" style="background-image:url('${thumbnailFor(version ? version.key : 'ember')}')">
            <div class="launch-art-content">
              <div class="launch-art-brand"><span class="mark">${brandMark()}</span><span>EMBER LAUNCHER</span></div>
              <div>
                <div class="launch-percent" id="launch-percent">0<small>%</small></div>
                <div class="launch-art-caption" id="launch-caption">Подготовка к запуску</div>
              </div>
            </div>
          </div>
          <div class="launch-body">
            <div class="launch-head">
              <div>
                <div class="eyebrow"><span class="sep"></span>ЗАПУСК ИГРЫ</div>
                <h2 class="launch-title" id="launch-title">${escapeHtml(version ? version.base : 'Minecraft')} <span class="loader-tag">${escapeHtml(info.short)}</span></h2>
                <div class="launch-stage"><span class="stage-dot is-pulse" id="launch-stage-dot"></span><span id="launch-stage-text">Подготовка профиля</span></div>
              </div>
              <button class="launch-close" data-action="launch-hide" aria-label="Свернуть окно запуска">${icon('close')}</button>
            </div>
            <div class="progress-track"><div class="progress-fill" id="launch-fill" style="width:0%"></div></div>
            <div class="launch-meta"><span class="file" id="launch-file"></span><span id="launch-meta-right">Java ${escapeHtml(java)} · ${state.config.ram} ГБ RAM</span></div>
            <div class="launch-console" id="launch-console"></div>
            <div id="launch-status"></div>
            <div class="launch-foot">
              <div class="launch-hint">${icon('shield')}<span id="launch-hint-text">Можно свернуть — загрузка продолжится</span></div>
              <div class="launch-actions" id="launch-actions"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    updateLaunchOverlay();
  }

  function updateLaunchOverlay() {
    const layer = $('#launch-layer');
    if (!layer) return;
    const launch = state.launch;
    const version = launch.version || getVersion(launch.key) || selectedVersion();
    const percent = clamp(Math.round(Number(launch.percent) || 0), 0, 100);

    layer.classList.toggle('is-error', Boolean(launch.error));
    const percentNode = $('#launch-percent');
    if (percentNode) percentNode.innerHTML = `${percent}<small>%</small>`;
    const fill = $('#launch-fill');
    if (fill) fill.style.width = `${percent}%`;
    const stage = $('#launch-stage-text');
    if (stage) stage.textContent = launch.stage || 'Подготовка';
    const dot = $('#launch-stage-dot');
    if (dot) dot.classList.toggle('is-pulse', !launch.error && !launch.started && !launch.closed && !launch.demo);

    const title = $('#launch-title');
    if (title && version) {
      title.innerHTML = `${escapeHtml(version.base)} <span class="loader-tag">${escapeHtml(loaderInfo(version.loader).short)}</span>`;
    }
    const file = $('#launch-file');
    if (file) file.textContent = launch.file || (launch.started ? 'Minecraft' : 'Проверка файлов…');
    const meta = $('#launch-meta-right');
    if (meta) meta.textContent = `Java ${version ? (version.javaVersion || version.requiredJava || '—') : '—'} · ${state.config.ram} ГБ RAM`;

    let caption = 'Подготовка к запуску';
    if (launch.error) caption = 'Ошибка запуска';
    else if (launch.closed) caption = 'Сеанс завершён';
    else if (launch.started) caption = 'Игра запущена';
    else if (launch.demo) caption = 'Демонстрация';
    const captionNode = $('#launch-caption');
    if (captionNode) captionNode.textContent = caption;

    const consoleNode = $('#launch-console');
    if (consoleNode) {
      const logs = launch.logs.slice(-7);
      consoleNode.innerHTML = logs.length
        ? logs.map(line => `<div>${escapeHtml(line)}</div>`).join('')
        : '<div>Инициализация сессии…</div>';
    }

    const status = $('#launch-status');
    if (status) {
      if (launch.error) {
        status.innerHTML = `<div class="launch-error">${icon('alert')}<div><p>${escapeHtml(launch.error)}</p>${launch.errorCode === 'no-java' || launch.errorCode === 'java-too-old' ? '<p style="margin-top:5px;color:#ffd0d0">Откройте настройки и укажите подходящую Java.</p>' : ''}</div></div>`;
      } else if (launch.closed) {
        status.innerHTML = `<div class="launch-success">${icon('clock')}<span>Игра закрыта. Сеанс и статистика сохранены.</span></div>`;
      } else if (launch.started) {
        status.innerHTML = `<div class="launch-success">${icon('check')}<span>Minecraft запущен. Окно игры уже открыто.</span></div>`;
      } else {
        status.innerHTML = '';
      }
    }

    const hint = $('#launch-hint-text');
    if (hint) {
      if (launch.error) hint.textContent = 'Проверьте настройки и попробуйте снова';
      else if (launch.closed) hint.textContent = 'Статистика сохранена';
      else if (launch.started) hint.textContent = 'Игра работает в отдельном окне';
      else hint.textContent = 'Можно свернуть — загрузка продолжится';
    }

    const actions = $('#launch-actions');
    if (actions) {
      if (launch.error) {
        const javaButton = launch.errorCode === 'no-java' || launch.errorCode === 'java-too-old'
          ? `<button class="btn" data-action="close-launch-settings">${icon('sliders')}Java</button>`
          : '';
        actions.innerHTML = `${javaButton}<button class="btn btn-primary" data-action="launch-close-overlay">Понятно</button>`;
      } else if (launch.started && launch.running) {
        actions.innerHTML = `<button class="btn btn-danger" data-action="launch-kill">${icon('stop')}Остановить</button><button class="btn btn-primary" data-action="launch-hide">Свернуть</button>`;
      } else if (launch.closed) {
        actions.innerHTML = `<button class="btn btn-primary" data-action="launch-close-overlay">Готово</button>`;
      } else {
        actions.innerHTML = `<button class="btn" data-action="launch-hide">Свернуть</button>`;
      }
    }
  }

  function openDemoLaunch() {
    const version = selectedVersion();
    state.launch = {
      open: true,
      demo: true,
      running: false,
      started: false,
      closed: false,
      error: null,
      errorCode: null,
      key: version ? version.key : null,
      percent: 68,
      stage: 'Загрузка ресурсов',
      file: 'assets/objects/4b/4bcd4777f62d484f1d563dc65f9cfd980edb4e4e',
      logs: [
        `Профиль ${version ? version.folder : 'Minecraft'} · ${version ? loaderInfo(version.loader).label : 'Vanilla'}`,
        'Проверка библиотек · 64 файла',
        'Java 21.0.7 · 4096 МБ',
        'Загрузка ресурсов · 1 284 объекта',
        'Подготовка окна 1280 × 720',
      ],
      version,
    };
    renderLaunch();
  }

  function handleLaunchEvent(payload) {
    if (!payload || !payload.type) return;
    const launch = state.launch;

    if (payload.type === 'begin') {
      launch.open = true;
      launch.running = true;
      launch.started = false;
      launch.closed = false;
      launch.error = null;
      launch.errorCode = null;
      launch.version = payload.version || launch.version || selectedVersion();
      launch.key = launch.version ? launch.version.key : launch.key;
      launch.percent = Math.max(Number(launch.percent) || 0, 2);
      launch.stage = 'Подготовка к запуску';
      if (payload.java) launch.logs.push(`Java ${payload.java.version || payload.java.major} · ${payload.memory || state.config.ram} ГБ RAM`);
      updateLaunchOverlay();
      renderShell();
      return;
    }

    if (payload.type === 'progress') {
      if (payload.stage) {
        if (payload.stage !== launch.stage) launch.logs.push(`▸ ${payload.stage}`);
        launch.stage = payload.stage;
      }
      if (payload.percent != null) launch.percent = payload.percent;
      updateLaunchOverlay();
      return;
    }

    if (payload.type === 'file') {
      launch.file = payload.file || '';
      updateLaunchOverlay();
      return;
    }

    if (payload.type === 'log') {
      if (payload.line) {
        launch.logs.push(payload.line);
        if (launch.logs.length > 90) launch.logs.splice(0, launch.logs.length - 90);
      }
      updateLaunchOverlay();
      return;
    }

    if (payload.type === 'started') {
      launch.running = true;
      launch.started = true;
      launch.percent = 100;
      launch.stage = 'Игра запущена';
      launch.logs.push('Minecraft запущен');
      updateLaunchOverlay();
      renderShell();
      toast('Minecraft запущен', `${launch.version ? launch.version.base : ''} · приятной игры`, 'success');
      return;
    }

    if (payload.type === 'error') {
      launch.error = payload.message || 'Ошибка запуска';
      launch.errorCode = /Java/i.test(launch.error) ? 'java-too-old' : launch.errorCode;
      launch.stage = 'Ошибка запуска';
      launch.running = false;
      launch.logs.push(launch.error);
      updateLaunchOverlay();
      renderShell();
      toast('Ошибка запуска', launch.error, 'error');
      return;
    }

    if (payload.type === 'closed') {
      launch.running = false;
      launch.closed = true;
      launch.percent = 100;
      launch.stage = 'Игра закрыта';
      launch.logs.push(`Сеанс завершён · код ${payload.code == null ? 0 : payload.code}`);
      const wasOpen = launch.open;
      updateLaunchOverlay();
      renderShell();
      if (!wasOpen) toast('Minecraft закрыт', 'Сеанс сохранён в статистике', 'info');
    }
  }

  /* ============================================================
     Data actions
     ============================================================ */

  async function refreshData() {
    try {
      const data = await window.ember.rescan();
      applyState(data);
      render();
      toast('Библиотека обновлена', `${state.versions.length} версий · ${state.mods.length} модов`, 'success');
    } catch (error) {
      toast('Не удалось обновить', cleanError(error), 'error');
    }
  }

  async function openFolder(kind) {
    try {
      const result = await window.ember.open(kind);
      if (result && result.ok === false) toast('Не удалось открыть папку', result.error || '', 'error');
    } catch (error) {
      toast('Не удалось открыть папку', cleanError(error), 'error');
    }
  }

  async function toggleMod(filename, targetEnabled) {
    if (state.busyMods.has(filename)) return;
    const mod = state.mods.find(item => item.file === filename);
    state.busyMods.add(filename);
    if (state.page === 'mods') updateModsGrid();
    try {
      const result = await window.ember.toggleMod({ filename, enabled: targetEnabled });
      state.mods = result.mods || state.mods;
      toast(targetEnabled ? 'Мод включён' : 'Мод отключён', mod ? mod.name : filename, 'success');
    } catch (error) {
      toast('Не удалось изменить мод', cleanError(error), 'error');
    } finally {
      state.busyMods.delete(filename);
      if (state.page === 'mods') updateModsGrid();
    }
  }

  async function pickFolder() {
    try {
      const result = await window.ember.pickFolder();
      if (!result || result.canceled) return;
      applyState(result.state);
      render();
      toast('Папка игры обновлена', state.config.root, 'success');
    } catch (error) {
      toast('Не удалось сменить папку', cleanError(error), 'error');
    }
  }

  async function pickJava() {
    try {
      const result = await window.ember.pickJava();
      if (!result || result.canceled) return;
      applyState(result.state);
      render();
      toast('Java обновлена', state.config.javaPath || 'Автовыбор', 'success');
    } catch (error) {
      toast('Не удалось выбрать Java', cleanError(error), 'error');
    }
  }

  function onMemoryInput(input) {
    const value = Number(input.value) || 1;
    const max = Number(input.max) || 8;
    state.config.ram = value;
    const label = $('#ram-value');
    if (label) label.textContent = String(value);
    const fill = max > 1 ? Math.round(((value - 1) / (max - 1)) * 100) : 0;
    input.style.setProperty('--fill', `${fill}%`);
    if (ramSaveTimer) clearTimeout(ramSaveTimer);
    ramSaveTimer = setTimeout(() => savePatch({ ram: value }), 420);
  }

  function onToggleSetting(button) {
    const key = button.dataset.key;
    if (!['fullscreen', 'closeOnLaunch', 'backgroundMotion', 'particles'].includes(key)) return;
    const value = !Boolean(state.config[key]);
    state.config[key] = value;
    button.classList.toggle('is-on', value);
    button.setAttribute('aria-checked', value ? 'true' : 'false');
    if (key === 'backgroundMotion') document.body.classList.toggle('no-motion', !value);
    if (key === 'particles') document.body.classList.toggle('no-particles', !value);
    savePatch({ [key]: value });
  }

  /* ============================================================
     Event handling
     ============================================================ */

  function bindEvents() {
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onChange);
    document.addEventListener('keydown', onKeydown);

    const view = $('#view');
    if (view) view.addEventListener('scroll', closePopover, { passive: true });
    window.addEventListener('resize', closePopover);

    const titlebar = $('.titlebar');
    if (titlebar) {
      titlebar.addEventListener('dblclick', event => {
        if (event.target.closest('button')) return;
        if (window.ember) window.ember.windowMaximize();
      });
    }

    document.addEventListener('keydown', event => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[role="button"][data-action]')) {
        event.preventDefault();
        event.target.click();
      }
    });
  }

  function onClick(event) {
    const popover = $('.popover');
    if (popover && !event.target.closest('.popover') && !event.target.closest('[data-action="open-picker"]')) closePopover();

    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    if (action === 'modal-backdrop') {
      if (event.target === target) closeModal();
      return;
    }

    if (action === 'navigate') {
      navigate(target.dataset.page || 'home');
      return;
    }

    if (action === 'play') {
      play(target.dataset.key || state.selected);
      return;
    }

    if (action === 'select-version') {
      selectVersion(target.dataset.key);
      return;
    }

    if (action === 'open-picker') {
      toggleVersionPicker(target);
      return;
    }

    if (action === 'picker-select') {
      selectVersion(target.dataset.key);
      closePopover();
      return;
    }

    if (action === 'account') {
      openAccountModal();
      return;
    }

    if (action === 'account-save') {
      saveAccount();
      return;
    }

    if (action === 'close-modal') {
      closeModal();
      return;
    }

    if (action === 'install-modal') {
      openInstallModal();
      return;
    }

    if (action === 'open-news') {
      openJournalModal();
      return;
    }

    if (action === 'refresh') {
      refreshData();
      return;
    }

    if (action === 'open-folder') {
      openFolder(target.dataset.kind || 'root');
      return;
    }

    if (action === 'copy-path') {
      copyText(target.dataset.path || '');
      return;
    }

    if (action === 'resume-last') {
      const key = state.config.lastVersionPlayed || state.selected;
      if (getVersion(key)) {
        selectVersion(key, { navigateTo: 'home', scrollTop: true });
      } else {
        navigate('home');
      }
      return;
    }

    if (action === 'version-filter') {
      state.filters.versions = target.dataset.filter || 'all';
      render();
      return;
    }

    if (action === 'toggle-mod') {
      toggleMod(target.dataset.file, target.dataset.enabled === '1');
      return;
    }

    if (action === 'toggle-setting') {
      onToggleSetting(target);
      return;
    }

    if (action === 'pick-folder') {
      pickFolder();
      return;
    }

    if (action === 'pick-java') {
      pickJava();
      return;
    }

    if (action === 'install-version') {
      installVersion(target.dataset.id, target.dataset.url);
      return;
    }

    if (action === 'retry-available') {
      loadAvailable();
      return;
    }

    if (action === 'retry-install') {
      const install = state.install;
      if (install && install.id && install.url) {
        state.install = null;
        installVersion(install.id, install.url);
      }
      return;
    }

    if (action === 'play-installed') {
      const key = target.dataset.key;
      closeModal();
      state.page = 'home';
      play(key);
      return;
    }

    if (action === 'available-type') {
      state.filters.availableType = target.dataset.type || 'release';
      renderInstallModal();
      return;
    }

    if (action === 'launch-hide') {
      hideLaunchOverlay();
      return;
    }

    if (action === 'launch-close-overlay') {
      hideLaunchOverlay();
      return;
    }

    if (action === 'launch-kill') {
      stopGame();
      return;
    }

    if (action === 'close-launch-settings') {
      state.launch.open = false;
      if (!state.launch.running) resetLaunchState();
      renderLaunch();
      navigate('settings');
      return;
    }

    if (action === 'win-min') {
      if (window.ember) window.ember.windowMinimize();
      return;
    }

    if (action === 'win-max') {
      if (window.ember) window.ember.windowMaximize();
      return;
    }

    if (action === 'win-close') {
      if (window.ember) window.ember.windowClose();
    }
  }

  function onInput(event) {
    const target = event.target;
    if (target.id === 'version-search') {
      state.filters.versionQuery = target.value;
      updateVersionsGrid();
      return;
    }
    if (target.id === 'mods-search') {
      state.filters.modsQuery = target.value;
      updateModsGrid();
      return;
    }
    if (target.id === 'available-search') {
      state.filters.availableQuery = target.value;
      updateAvailableList();
      return;
    }
    if (target.id === 'ram-range') {
      onMemoryInput(target);
      return;
    }
    if (target.id === 'account-nick') {
      updateAccountPreview();
    }
  }

  function onChange(event) {
    const target = event.target;
    if (target.id === 'resolution-select') {
      const [width, height] = String(target.value).split('x').map(Number);
      if (width > 0 && height > 0) {
        state.config.resolution = { width, height };
        savePatch({ resolution: { width, height } });
      }
      return;
    }
    if (target.id === 'java-select') {
      const javaPath = target.value;
      state.config.javaPath = javaPath;
      savePatch({ javaPath }).then(() => {
        if (state.page === 'settings') render();
      });
    }
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      if ($('#modal-root') && $('#modal-root').children.length) {
        closeModal();
        return;
      }
      if ($('.popover')) {
        closePopover();
        return;
      }
      if (state.launch.open) {
        hideLaunchOverlay();
      }
      return;
    }

    if (event.key === 'Enter' && event.target.id === 'account-nick') {
      event.preventDefault();
      saveAccount();
      return;
    }

    if (event.key === 'F5' || (event.ctrlKey && event.key.toLowerCase() === 'r')) {
      event.preventDefault();
      refreshData();
    }
  }

  /* ============================================================
     Main-process events / screenshot hook / boot
     ============================================================ */

  function handleStats(payload) {
    if (!payload) return;
    state.config.launches = payload.launches != null ? payload.launches : state.config.launches;
    state.config.lastPlayedAt = payload.lastPlayedAt || state.config.lastPlayedAt;
    state.config.playtimeMs = payload.totalPlaytimeMs != null ? payload.totalPlaytimeMs : state.config.playtimeMs;
    if (state.page === 'home') render();
  }

  function handleLibrary(payload) {
    if (!payload) return;
    if (Array.isArray(payload.versions)) state.versions = payload.versions;
    if (Array.isArray(payload.mods)) state.mods = payload.mods;
    if (Array.isArray(payload.java)) state.java = payload.java;
    if (Number.isFinite(payload.worlds)) state.worlds = payload.worlds;
    const keys = state.versions.map(version => version.key);
    if (!state.selected || !keys.includes(state.selected)) {
      state.selected = keys.includes(state.config.lastVersionKey) ? state.config.lastVersionKey : (keys[0] || null);
    }
    render();
  }

  function bindMainEvents() {
    if (!window.ember) return;
    window.ember.onLaunch(handleLaunchEvent);
    window.ember.onInstall(handleInstallEvent);
    window.ember.onStats(handleStats);
    window.ember.onLibrary(handleLibrary);
    window.ember.onWindowState(() => {});
  }

  window.__emberScreenshot = async (page, mode) => {
    closePopover();
    closeModal();
    if (state.launch.open) hideLaunchOverlay();
    if (page) navigate(page);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (mode === 'account') openAccountModal();
    else if (mode === 'available') openInstallModal();
    else if (mode === 'launch-demo') openDemoLaunch();
    await new Promise(resolve => requestAnimationFrame(resolve));
    return {
      page: state.page,
      ready: state.ready,
      modal: state.modal,
      launchOpen: state.launch.open,
      modalCount: document.querySelectorAll('.modal').length,
      launchCount: document.querySelectorAll('.launch-layer').length,
      viewLength: (document.querySelector('#view') || {}).innerHTML?.length || 0,
    };
  };

  bindMainEvents();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
