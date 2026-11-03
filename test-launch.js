const { Client, Authenticator } = require('minecraft-launcher-core');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const name = 'TImoxa_gub123';
const hash = crypto.createHash('md5').update(name).digest('hex');
const uuid = `${hash.slice(0,8)}-${hash.slice(8,12)}-3${hash.slice(13,16)}-a${hash.slice(17,20)}-${hash.slice(20)}`;

const launcher = new Client();
const opts = {
  authorization: {
    access_token: '0'.repeat(32),
    client_token: '0'.repeat(32),
    uuid,
    name,
    user_properties: '{}',
    meta: { type: 'Legacy', demo: false }
  },
  root: path.join(os.homedir(), 'AppData', 'Roaming', '.minecraft'),
  version: { number: '1.8.9', type: 'release' },
  memory: { max: '2G', min: '1G' },
  javaPath: path.join(os.homedir(), 'AppData', 'Roaming', '.minecraft', 'runtime', 'jre-legacy', 'windows-x64', '8u51-cacert462b08', 'bin', 'java.exe'),
  window: { width: 854, height: 480 }
};
launcher.on('debug', e => console.log('[debug]', e));
launcher.on('data', e => console.log('[data]', e));
launcher.on('progress', e => console.log('[progress]', JSON.stringify(e).slice(0, 300)));
launcher.on('download', e => console.log('[download]', e));
launcher.on('download-status', e => {});
launcher.on('error', e => console.log('[error]', e));
launcher.on('close', e => { console.log('[close]', e); process.exit(0); });
(async () => {
  try {
    const child = await launcher.launch(opts);
    console.log('LAUNCHED pid', child && child.pid);
    setTimeout(() => {
      console.log('KILLING after 25s');
      try { require('child_process').execSync(`taskkill /PID ${child.pid} /T /F`); } catch (e) { console.log('kill err', e.message); }
      process.exit(0);
    }, 25000);
  } catch (e) {
    console.error('FAIL', e);
    process.exit(1);
  }
})();
