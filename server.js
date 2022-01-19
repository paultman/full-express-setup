const { MongoClient } = require('mongodb');
const appConfig = require('./config/app');
const logger = require('./lib/logger');
const app = require('./app');

const localMongoURI = `mongodb://${appConfig.db.host}:${appConfig.db.port}/?maxPoolSize=20&w=majority`;
const mongoClient = new MongoClient(localMongoURI);
const db = mongoClient.db(appConfig.db.name);

(async function start() {
  app.init(appConfig, logger, db);
  app.listen(appConfig.app.port, () => {
    logger.info(`Server listening at http://localhost:${appConfig.app.port}`);
  });
})();
