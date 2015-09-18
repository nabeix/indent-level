var Transform = require('stream').Transform;
var util = require('util');
var fs = require('fs');

var JSON_START = 0;
var JSON_END = 1;
var BLOCK_START = 2;
var BLOCK_END = 3;
var LINE_START = 4;
var LINE_END = 5;

function JsonIDC(options) {
  if (!(this instanceof JsonIDC)) return new JsonIDC(options);
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

util.inherits(JsonIDC, Transform);

JsonIDC.prototype.parse = function(data) {
  var lines = [];
  data.split(/(?:\r\n|[\r\n])/).forEach(function(line) {
    if (line.length > 0) {
      lines.push(line);
    }
  });
  lines.forEach(function(line) {
    var indentOnly = true;
    line.split('').forEach(function(ch) {
      switch(ch) {
        case ' ':
          break;
        case '\t':
          break;
        default:
          indentOnly = false;
          break;
      }
    });
    if (!indentOnly) {
      
    }
  });
  console.log(this.status);
};

JsonIDC.prototype._transform = function(chunk, encoding, done) {
  // console.log('JsonIDC#_transform');
  this.rawJson += chunk;
  done();
};

JsonIDC.prototype._flush = function(done) {
  // console.log('JsonIDC#_flush');
  this.push(this.rawJson);
  this.parse(this.rawJson);
  done();
};

module.exports = JsonIDC;
