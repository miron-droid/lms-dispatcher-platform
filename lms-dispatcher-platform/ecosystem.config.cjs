module.exports = {
  apps: [
    {
      name: 'lms-api',
      cwd: '/var/www/lms-dispatcher-platform/apps/api',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      listen_timeout: 5000,
      kill_timeout: 5000,
      wait_ready: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
    {
      name: 'lms-web',
      cwd: '/var/www/lms-dispatcher-platform/apps/web',
      script: 'node_modules/.bin/next',
      args: 'start -p 3200',
      instances: 1,
      exec_mode: 'fork',
      listen_timeout: 8000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'https://dispatchgo.net/api/v1',
      },
    },
  ],
};
