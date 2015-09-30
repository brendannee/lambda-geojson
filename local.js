var fs = require('fs');
var lambda = require('./index.js');

var sampleData;

try {
  sampleData = JSON.parse(fs.readFileSync('sample-data/data.json', 'utf8'));
} catch(e) {
  console.error('Invalid JSON sample file');
  process.exit(1);
}


function Context () {}

Context.done = function(e, message) {
  if(e) {
    console.error(e);
    process.exit(1);
  }

  console.log(message);
  process.exit();
};

lambda.handler(sampleData, Context);
