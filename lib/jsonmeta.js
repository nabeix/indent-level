var Transform = require('stream').Transform;
var util = require('util');
var fs = require('fs');

function JsonMeta(options) {
  if (!(this instanceof JsonMeta)) return new JsonMeta(options);
  Transform.call(this, options);
  this.rawJson = '';
  return this;
};

util.inherits(JsonMeta, Transform);

JsonMeta.prototype.parse = function(data) {
  for (var i = 0; i < data.length; i++) {
    var ch = data[i];
    switch (ch) {
      case '{':
        break;
      case '}':
        break;
      case ',':
        break;
      case '\n':
        break;
      case '\r':
        break;
      default:
        break;
    }
  }
};

JsonMeta.prototype._transform = function(chunk, encoding, done) {
  // console.log('JsonMeta#_transform');
  this.rawJson += chunk;
  done();
};

JsonMeta.prototype._flush = function(done) {
  // console.log('JsonMeta#_flush');
  this.push(this.rawJson);
  this.parse(this.rawJson);
  done();
};

module.exports = JsonMeta;
