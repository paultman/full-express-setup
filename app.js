const express = require('express');
const morgan = require('morgan');

const app = express();
app.locals.projDir = __dirname;

app.init = (config, logger, db) => {
  app.use(
    morgan('tiny', {
      stream: {
        write: (message) => logger.info(message),
      },
    })
  );
  app.get('/', (req, res) => {
    res.send(`running in ${config.app.env} environment`);
  });
};

module.exports = app;
