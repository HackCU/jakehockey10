/**
 * Created by jake on 4/11/15.
 */
var secrets = require('../config/secrets');
var querystring = require('querystring');
var validator = require('validator');
var async = require('async');
var moment = require('moment');
var contextio = require('contextio');
var contextioClient = new contextio.Client({key: secrets.contextio.key, secret: secrets.contextio.secret});
var _ = require('lodash');
var querystring = require('querystring');

/**
 * GET /api/contextio
 * ContextIO API example.
 */
exports.getContextIO = function (req, res, next) {
  contextioClient.accounts().get({limit: 15}, function (err, response) {
    if (err) throw err;
    res.render('contextio/accounts', {
      accounts: response.body
    });
  })
};

exports.getContextIOAccountDetail = function (req, res, next) {
  async.parallel({
      contacts: function (callback) {
        contextioClient.accounts(req.params.id).contacts().get({limit: 50}, function (err, results) {
          callback(err, results);
        });
      }/*,
      venueDetail: function (callback) {
        foursquare.Venues.getVenue('49da74aef964a5208b5e1fe3', token.accessToken, function (err, results) {
          callback(err, results);
        });
      },
      userCheckins: function (callback) {
        foursquare.Users.getCheckins('self', null, token.accessToken, function (err, results) {
          callback(err, results);
        });
      }*/
    },
    function (err, results) {
      if (err) return next(err);
      res.render('contextio/account', {
        id: req.params.id,
        account_contacts: results.contacts.body.matches,
        venueDetail: results.venueDetail,
        userCheckins: results.userCheckins
      });
    });
};

exports.getContextIOMessages = function (req, res, next) {
  contextioClient.accounts(req.params.id).messages().get({limit: 100}, function (err, response) {
    if (err) throw err;
    var messages = _.sortBy(response.body, ['date', 'gmail_thread_id']);
    _.forEach(messages, function (m) {
      m.date = moment(new Date(m.date*1000)).fromNow();
    });
    res.render('contextio/messages', {
      id: req.params.id,
      messages: response.body
    })
  })
};

exports.getContextIOMessage = function (req, res, next) {
  contextioClient.accounts(req.params.id).messages(req.params.message).body().get(function (err, result) {
    if (err) throw err;
    res.render('contextio/message', {
      message: result.body
    })
  })
};

exports.postContextIOWebhook = function (req, res, next) {
  console.log(res);
  res.status(200).render('webhook', {
    webook: res.body
  })
};

exports.getContextIOThreads = function (req, res, next) {
  contextioClient.accounts(req.params.id).threads().get({limit: 1}, function (err, response) {
    if (err) throw err;
    var threads = [];
    async.each(response.body, function (thread, callback) {
      contextioClient.accounts(req.params.id).threads(thread.split("/").pop()).get(function (err, thread) {
        threads.push(thread.body);
        callback();
      });
    }, function (err) {
      res.render('contextio/threads', {
        threads: threads
      })
    });
  })
};

exports.getContextIOContactThreads = function (req, res, next) {
  var id = req.params.id;
  var email = req.query.email;
  contextioClient.accounts(id).contacts(email).threads().get({limit: 1}, function (err, response) {
    if (err) throw err;
    console.log('gettings threads');
    var threads = [];
    async.each(response.body, function (thread, callback) {
      console.log('id: ' + id);
      contextioClient.accounts(id).threads(thread.split("/").pop()).get(function (err, thread) {
        threads.push(thread.body);
        callback();
      });
    }, function (err) {
      res.render('contextio/contact', {
        threads: threads
      })
    });
  })
};

//exports.getContextIOContactInfo = function (req, res, next) {
//  async.parallel({
//    //files: function (callback) {
//    //  contextioClient.accounts(req.params.id).contacts(req.params.email).files().get({limit: 10}, function (err, results) {
//    //    callback(err, results);
//    //  });
//    //},
//    //messages: function (callback) {
//    //  console.log('getting messages');
//    //  contextioClient.accounts(req.params.id).contacts(req.params.email).messages().get({limit: 10}, function (err, results) {
//    //    callback(err, results);
//    //  });
//    //},
//    threads: function (callback) {
//      console.log('gettings threads');
//      contextioClient.accounts(req.params.id).threads().get({limit: 1}, function (err, response) {
//        if (err) throw err;
//        var threads = [];
//        async.each(response.body, function (thread, callback) {
//          contextioClient.accounts(req.params.id).threads(thread.split("/").pop()).get(function (err, thread) {
//            threads.push(thread.body);
//            callback();
//          });
//        }, function (err) {
//          return threads;
//        });
//      })
//    }
//  },
//  function (err, results) {
//    if (err) return next(err);
//    var messages = _.sortBy(results.messages.body, 'date');
//    res.render('contextio/contact', {
//      //files: results.files.body,
//      messages: messages,
//      threads: results.threads
//    })
//  })
//};