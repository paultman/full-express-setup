// config.js
const env = process.env.APP_ENV; // 'prod', 'dev', or 'test'

const dev = {
  app: {
    env,
    port: 3000,
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'db',
    username: process.env.db_username || 'admin',
    password: process.env.db_password || 'password',
  },
  log: {
    level: 'info',
  },
};

const prod = {
  app: {
    env,
    port: 3000,
  },
  db: {
    host: '54.82.34.81',
    port: 27018,
    name: 'prodDB',
    username: process.env.db_username,
    password: process.env.db_password,
  },
};

const config = {
  prod,
  dev,
};

module.exports = config[env];
