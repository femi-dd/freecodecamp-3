var mongoose = require('mongoose');

var { Schema } = { ...mongoose };

var UrlModel = new Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: String,
  }
});

var URLModel = mongoose.model('url', UrlModel);
module.exports = URLModel;
