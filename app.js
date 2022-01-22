const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const userRoutes = require('./controllers/users');

const app = express();
app.locals.projDir = __dirname;

app.use(
  cookieSession({
    name: 'session',
    maxAge: 1000 * 60 * 60 * 24 * 7, // miliseconds from now to expire, 1wk
    httpOnly: true, // unreadable via client JS
    sameSite: 'lax', // only sent from same website
    signed: true, // include signature to check tampering
    // secure: true, // must be over https
    keys: ['s3cr3t'],
  })
);

app.init = (config, logger, db) => {
  userRoutes.init(config, logger, db);
  app.use(
    morgan('tiny', {
      stream: {
        write: (message) => logger.info(message),
      },
    })
  );

  const checkAuth = (req, res, next) => {
    if (!(req.session && req.session.ref)) {
      if (req.headers['x-requested-with']) {
        // if request is an ajax request send json back
        res.status(302).send({ url: '/' });
      } else {
        res.redirect('/'); // do normal 302 redirect
      }
    } else next(); // they have an untampored with token, could further validatate here
  };

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get('/', (req, res) => {
    logger.info(`running in ${config.app.env} environment`);
    res.sendFile(`${__dirname}/client/index.html`);
  });
  app.get('/home.html', checkAuth, (req, res) => {
    res.sendFile(`${__dirname}/client/home.html`);
  });

  app.post('/login', userRoutes.login);
  app.post('/register', userRoutes.register);
  app.get('/logout', userRoutes.logout);
};
module.exports = app;
