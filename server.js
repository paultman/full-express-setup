const appConfig = require('./config/app');
const logger = require('./lib/logger');
const app = require('./app');

(async function start() {
  app.init(appConfig, logger);
  app.listen(appConfig.app.port, () => {
    logger.info(`Server listening at http://localhost:${appConfig.app.port}`);
  });
})();
