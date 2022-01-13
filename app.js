const express = require('express');

const app = express();
app.locals.projDir = __dirname;

app.init = (config) => {
  app.get('/', (req, res) => {
    res.send(`running in ${config.app.env} environment`);
  });
};

module.exports = app;
