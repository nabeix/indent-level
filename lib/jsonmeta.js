var Transform = require('stream').Transform;
var util = require('util');
var fs = require('fs');

function JsonMeta(options) {
  if (!(this instanceof JsonMeta)) return new JsonMeta(options);
  Transform.call(this, options);
  this.rawJson = '';
}

util.inherits(JsonMeta, Transform);

JsonMeta.prototype.parse = function(data) {
  // TODO
};

JsonMeta.prototype._transform = function(chunk, encoding, done) {
  //console.log('JsonMeta#_transform');
  this.rawJson += chunk;
  done();
};

JsonMeta.prototype._flush = function(done) {
  //console.log('JsonMeta#_flush');
  this.push(this.rawJson);
  done();
};

module.exports = JsonMeta;
