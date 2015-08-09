#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var JsonMeta = require('../');

program
  .version(require('../package.json').version)
  .usage('[options] <file>')
  .option('-e, --encoding [value]', 'Character encoding(default \'utf8\')')
  .parse(process.argv);

if (program.args.length < 1) {
  program.help();
}

var encoding = program.encoding ? program.encoding : 'utf8';
var jsonPath  = program.args[0];


var jsonMeta = new JsonMeta();

fs.createReadStream(jsonPath).pipe(jsonMeta).pipe(process.stdout);
