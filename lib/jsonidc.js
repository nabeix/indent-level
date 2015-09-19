var Transform = require('stream').Transform;
var util = require('util');
var fs = require('fs');


var TYPE_UNKNOWN = 0;
var TYPE_SPACE = 1;
var TYPE_TAB = 2;
var TYPE_MIX = 3;

function JsonIDC(options) {
  if (!(this instanceof JsonIDC)) return new JsonIDC(options);
  Transform.call(this, options);
  this.rawJson = '';
  this.indents = [];
  return this;
};

util.inherits(JsonIDC, Transform);

JsonIDC.prototype.parse = function(data) {
  var lines = data.split(/(?:\r\n|[\r\n])/);
  var type = TYPE_UNKNOWN;
  lines.forEach(function(line) {
    var indent = '';
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      switch(ch) {
        case ' ':
          indent += ch;
          if (type === TYPE_UNKNOWN)
            type = TYPE_SPACE;
          else if (type === TYPE_TAB)
            type = TYPE_MIX;
          break;
        case '\t':
          indent += ch;
          if (type === TYPE_UNKNOWN)
            type = TYPE_TAB;
          else if (type === TYPE_SPACE)
            type = TYPE_MIX;
          break;
        default:
          continue;
          break;
      }
    }
    this.indents.push(indent);
  }.bind(this));
  if (type === TYPE_MIX) {
    // TODO: convert tab to space
  }
  var indentLengthList = [];
  this.indents.forEach(function(indent, index) {
    indentLengthList.push({length: indent.length, line: index});
  });

  // sort by length
  var sorted = indentLengthList.concat().sort(function(a, b) {
    if (a.length > b.length)
      return 1;
    else if (a.length < b.length)
      return -1;
    return 0;
  });

  // define indent level
  var level = 0;
  var currentLevelLength = 0;
  sorted.forEach(function(info) {
    if (info.length > currentLevelLength) {
      level++;
      currentLevelLength = info.length;
    }
    info.level = level;
  });
  console.log(sorted);
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
