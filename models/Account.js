var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now() },
  id: String,
  emails: Array,
  first_name: String,
  last_name: String,
  password_expired: Number
});

module.exports = mongoose.model('Account', accountSchema);