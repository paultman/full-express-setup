const appConfig = require('./config/app');
const app = require('./app');

(async function start() {
  app.init(appConfig);
  app.listen(appConfig.app.port, () => {
    console.log(`Server listening at http://localhost:${appConfig.app.port}`);
  });
})();
