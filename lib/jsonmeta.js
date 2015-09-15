var Transform = require('stream').Transform;
var util = require('util');
var fs = require('fs');

var BLOCK_START = 0;
var BLOCK_END = 1;

function JsonMeta(options) {
  if (!(this instanceof JsonMeta)) return new JsonMeta(options);
  Transform.call(this, options);
  this.rawJson = '';
  this.status = [];
  this.result = {
    indent: {
    },
    depth: {},
    charCount: null,
    lineCount: null,
    lineBreakCode: null,
    propertyCount:null
  };
  return this;
};

util.inherits(JsonMeta, Transform);

JsonMeta.prototype.parse = function(data) {
  var indent = 0;
  var before = null;
  for (var i = 0; i < data.length; i++) {
    var ch = data[i];
    switch (ch) {
      case '{':
        this.status.push(BLOCK_START);
        break;
      case '}':
        this.status.push(BLOCK_END);
        break;
      case ',':
        break;
      case ' ':
        break;
      case '\t':
        this.result.indent.tab = true;
        break;
      case '\n':
        break;
      case '\r':
        break;
      default:
        break;
    }
    before = ch;
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
