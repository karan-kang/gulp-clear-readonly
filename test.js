'use strict'

const assert = require('assert');
const gutil = require('gulp-util');
const dirPath = __dirname;
const fs = require("fs");
const path = require("path");
const clearReadOnly = require('./');

it('should run on travis', function(){
  assert.ok(true);
});

it('should remove read only flag', function(done){
  var file = createReadOnlyFile();
  clearReadOnly(file, function(){
    fs.access(file, fs.W_OK, function(err) {
      assert.ok(!err);
      done();
    });
  }, { 
    isFile: true
  });
});

// TODO: Tests will be added here once i have some time.
function createReadOnlyFile(){
  var fileName = 'Test' + Date.now();
  var filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, fileName);
  
  // Mark file permissions as readonly
  fs.chmodSync(filePath, '444');
  return filePath;
}
