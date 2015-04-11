var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  type: { type: String, unique: false, lowercase: true },
  charset: { type: String, unique: false, lowercase: true },
  content: String
});

module.exports = mongoose.model('Message', messageSchema);