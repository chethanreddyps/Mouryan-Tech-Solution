const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const serverRoot = path.join(root, 'server');

const isWindows = process.platform === 'win32';
const spawnOpts = { stdio: 'inherit', shell: isWindows };

// Start backend Express server
const backend = spawn(process.execPath, ['server.js'], {
  ...spawnOpts,
  cwd: serverRoot
});

// Start Vite frontend dev server
const frontend = spawn('npx', ['vite', '--host'], {
  ...spawnOpts,
  cwd: root
});

const processes = [backend, frontend];

backend.on('error', (err) => console.error('[server] Failed to start:', err.message));
frontend.on('error', (err) => console.error('[vite] Failed to start:', err.message));

const stop = () => processes.forEach((child) => { try { child.kill(); } catch (_) {} });
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
process.on('exit', stop);
