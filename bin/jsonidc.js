#!/usr/bin/env node

var program = require('commander');
var fs = require('fs');
var JsonIDC = require('../');

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


var jsonIDC = new JsonIDC();

fs.createReadStream(jsonPath).pipe(jsonIDC).pipe(process.stdout);
