#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var IndentLevel = require('../');

program
  .version(require('../package.json').version)
  .usage('[options] <file>')
  .option('-e, --encoding [value]', 'Character encoding(default \'utf8\')')
  .parse(process.argv);

if (program.args.length < 1) {
  program.help();
}

var encoding = program.encoding ? program.encoding : 'utf8';
var filePath  = program.args[0];


var indentLevel = new IndentLevel();

fs.createReadStream(filePath).pipe(indentLevel).pipe(process.stdout);
