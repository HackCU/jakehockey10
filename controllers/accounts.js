var _ = require('lodash');
var async = require('async');
var Account = require('../models/Account');
var secrets = require('../config/secrets');

exports.getAccount = function (req, res) {
  if (req.account) return res.redirect('/accounts');
  res.render('contextio/account', {

  })
};

