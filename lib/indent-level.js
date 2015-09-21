var Transform = require('stream').Transform;
var util = require('util');
var fs = require('fs');


var TYPE_UNKNOWN = 0;
var TYPE_SPACE = 1;
var TYPE_TAB = 2;
var TYPE_MIX = 3;

function createBase(maxLength, indents) {
  var base = '';
  for (var i = 0, j = 0; i < maxLength; i++) {
    if (indents[j] === i) {
      base += '|';
      j++;
    } else {
      base += ' ';
    }
  }
  return base;
}

function IndentLevel(options) {
  if (!(this instanceof IndentLevel)) return new IndentLevel(options);
  Transform.call(this, options);
  this.rawText = '';
  this.lines = [];
  this.indents = [0];
  this.maxLength = 0;
  this.result = '';
  return this;
};

util.inherits(IndentLevel, Transform);

IndentLevel.prototype.parse = function(data) {
  var lines = data.split(/(?:\r\n|[\r\n])/);
  if (lines[lines.length - 1].length === 0) {
    // NOTE: is it correct?
    lines.pop();
  }

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
    this.lines.push({text: line, indentInfo: {indent: indent}});
    if (this.maxLength < line.length)
      this.maxLength = line.length;
  }.bind(this));
  if (type === TYPE_MIX) {
    // TODO: convert tab to space
  }
  var indentInfoList = [];
  this.lines.forEach(function(line) {
    indentInfoList.push(line.indentInfo);
  });

  // sort by length
  indentInfoList.sort(function(a, b) {
    if (a.indent.length > b.indent.length)
      return 1;
    else if (a.indent.length < b.indent.length)
      return -1;
    return 0;
  });

  // define indent level
  var level = 0;
  var currentLevelLength = 0;
  indentInfoList.forEach(function(info) {
    if (info.indent.length > currentLevelLength) {
      level++;
      currentLevelLength = info.indent.length;
      this.indents.push(currentLevelLength);
    }
    info.level = level;
  }.bind(this));

  // make result
  var base = createBase(this.maxLength, this.indents);
  this.lines.forEach(function(line, index) {
    this.result += index + 1 + ':' + line.indentInfo.level + ' ' + this.textWithIndentLevel(line, base) + '\n';
  }.bind(this));
};

IndentLevel.prototype.textWithIndentLevel = function(line, base) {
  var before = base.substring(0, line.indentInfo.indent.length);
  var body = line.text.substring(line.indentInfo.indent.length, line.text.length);
  var after = base.substring(line.text.length);
  return before + body + after;
};

IndentLevel.prototype._transform = function(chunk, encoding, done) {
  //console.log('IndentLevel#_transform');
  this.rawText += chunk;
  done();
};

IndentLevel.prototype._flush = function(done) {
  //console.log('IndentLevel#_flush');
  this.parse(this.rawText);
  this.push(this.result);
  done();
};

module.exports = IndentLevel;

