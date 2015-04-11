/**
 * Created by jake on 4/11/15.
 */
var secrets = require('../config/secrets');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var contextio = require('contextio');
var contextioClient = new contextio.Client({key: secrets.contextio.key, secret: secrets.contextio.secret});
var _ = require('lodash');

/**
 * GET /api/contextio
 * ContextIO API example.
 */
exports.getContextIO = function(req, res, next) {
  contextioClient.accounts().get({limit: 15}, function (err, response) {
    if (err) throw err;
    res.render('contextio/accounts', {
      accounts: response.body
    });
  })
};

exports.getContextIOAccountDetail = function (req, res, next) {
  async.parallel({
      contacts: function(callback) {
        contextioClient.accounts(req.params.id).contacts().get({limit: 50}, function (err, results) {
          callback(err, results);
        });
      }/*,
       venueDetail: function(callback) {
       foursquare.Venues.getVenue('49da74aef964a5208b5e1fe3', token.accessToken, function(err, results) {
       callback(err, results);
       });
       },
       userCheckins: function(callback) {
       foursquare.Users.getCheckins('self', null, token.accessToken, function(err, results) {
       callback(err, results);
       });
       }*/
    },
    function(err, results) {
      if (err) return next(err);
      console.log(results.contacts.body);
      res.render('contextio/account', {
        account_contacts: results.contacts.body.matches,
        venueDetail: results.venueDetail,
        userCheckins: results.userCheckins
      });
    });
};