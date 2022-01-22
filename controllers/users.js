/**
 * @module users
 */

const bcrypt = require('bcrypt');
const path = require('path');

module.exports.init = async (config, logger, db) => {
  this.userCol = db.collection('users');
};

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

module.exports.logout = async (req, res) => {
  req.session = null;
  res.sendFile(path.join(req.app.locals.projDir, '/client/index.html'));
};
