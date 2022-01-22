const { MongoClient } = require('mongodb');
const appConfig = require('./config/app');
const logger = require('./lib/logger');
const app = require('./app');

const localMongoURI = `mongodb://${appConfig.db.host}:${appConfig.db.port}/?maxPoolSize=20&w=majority`;
MongoClient.connect(localMongoURI).then((client) => {
  const db = client.db(appConfig.db.name);
  app.init(appConfig, logger, db);
  app.listen(appConfig.app.port, () => {
    logger.info(`Server listening at http://localhost:${appConfig.app.port}`);
  });
});
