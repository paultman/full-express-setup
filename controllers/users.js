/**
 * @module users
 */

const bcrypt = require('bcrypt');
const path = require('path');

/**
 * @public
 * @function init
 * @name initialize controller
 * @description this function initializes the user controller with basic assets from main app entrypoint
 * @param {Object} config application configuration, settings read from disk and process environment
 * @param {Object} logger a log instance shared between components configured per environment
 * @param {Object} db an initalized and actively connected database shared between components.
 * @returns {undefined}
 */

module.exports.init = async (config, logger, db) => {
  this.config = config;
  this.logger = logger;
  this.userCol = db.collection('users');
};

/**
 * @public
 * @function login
 * @name POST /login
 * @description takes a form as input and looks for associated user record.  If successful, set cookie with user info and redirect to protected home dashboard, else return error.
 * @param {Object} req Express request with form elements in body of post
 * @param {Object} res return set cookie and redirect or error message in json format
 * @returns {undefined}
 */

module.exports.login = async (req, res) => {
  const record = await this.userCol.findOne({ email: req.body.email });
  if (record === null) {
    res.status('401').json({ msg: `no record found with email ${req.body.email}` });
  } else if (!bcrypt.compareSync(req.body.password, record.passHash)) {
    res.status('403').json({ msg: 'wrong password' });
  } else {
    req.session.ref = record._id.toString();
    res.redirect('/home.html');
  }
};

/**
 * @public
 * @function register
 * @name POST /register
 * @description takes a form as input and tries to create a new acct in the database, sets a client state cookie, and redirects to user dashboard.  If db operation fails, return error message.
 * @param {Object} req Express request with form elements in body of post
 * @param {Object} res return set cookie and redirect to home.html, else error message in json format
 * @returns {undefined}
 */

module.exports.register = async (req, res) => {
  const user = {
    email: req.body.email,
    passHash: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
  };
  const ref = await this.userCol.insertOne(user);
  if (!req.session) req.session = {};
  req.session.ref = ref.insertedId.toString();
  res.redirect('/home.html');
};

/**
 * @public
 * @function logout
 * @name get /logout
 * @description this function simply clears a httponly cookie from the client by setting it to empty string and returns the unauthenticated index page
 * @param {Object} req Express request
 * @param {Object} res empty body but cookie middleware sets response header
 * @returns {undefined}
 */
module.exports.logout = async (req, res) => {
  req.session = null;
  res.sendFile(path.join(req.app.locals.projDir, '/client/index.html'));
};
