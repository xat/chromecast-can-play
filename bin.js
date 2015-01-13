#!/usr/bin/env node

var canPlay = require('./index');
var input = process.argv[2];

if (!input) {
  return console.log('input missing');
}

canPlay(input, function(err, result) {
  if (err) return console.log('ffprobe error');
  console.log(JSON.stringify(result, null, 4));
});
