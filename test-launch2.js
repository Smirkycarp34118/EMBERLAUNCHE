const { Client } = require('minecraft-launcher-core');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync } = require('child_process');

const name = 'TImoxa_gub123';
const hash = crypto.createHash('md5').update(name).digest('hex');
const uuid = `${hash.slice(0,8)}-${hash.slice(8,12)}-3${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20)}`;

const target = process.argv[2] || '1.21.4';
const custom = process.argv[3] || null;
const root = path.join(os.homedir(), 'AppData', 'Roaming', '.minecraft');
const javaPath = target.startsWith('1.8') || target.startsWith('1.7') || target.startsWith('1.12')
  ? path.join(root, 'runtime', 'jre-legacy', 'windows-x64', '8u51-cacert462b08', 'bin', 'java.exe')
  : path.join(root, 'runtime', 'java-runtime-delta', 'windows-x64', '21.0.7', 'bin', 'java.exe');

const launcher = new Client();
const opts = {
  authorization: {
    access_token: '0'.repeat(32),
    client_token: '0'.repeat(32),
    uuid,
    name,
    user_properties: '{}',
    meta: { type: 'msa', demo: false }
  },
  root,
  version: custom ? { number: target, type: 'release', custom } : { number: target, type: 'release' },
  memory: { max: '3G', min: '1G' },
  javaPath,
  window: { width: 854, height: 480 }
};
let launched = false;
launcher.on('debug', e => { if (!String(e).startsWith('[MCLC]: Attempting')) console.log('[debug]', String(e).slice(0,300)); });
launcher.on('data', e => console.log('[data]', String(e).slice(0,500)));
launcher.on('progress', e => {});
launcher.on('download', e => {});
launcher.on('error', e => console.log('[error]', e));
launcher.on('close', e => { console.log('[close]', e); process.exit(0); });
(async () => {
  try {
    const child = await launcher.launch(opts);
    launched = true;
    console.log('LAUNCHED pid', child && child.pid, 'version', target, custom || '');
    setTimeout(() => {
      console.log('KILLING after 20s');
      try { execSync(`taskkill /PID ${child.pid} /T /F`, {stdio:'ignore'}); } catch (e) {}
      process.exit(0);
    }, 20000);
  } catch (e) {
    console.error('FAIL', e);
    process.exit(1);
  }
})();
