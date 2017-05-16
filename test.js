'use strict'

const assert = require('assert');
const gutil = require('gulp-util');
const dirPath = __dirname;
const fs = require("fs");
const path = require("path");
const clearReadOnly = require('./');
const generatedFiles = [];

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

// Clean up generated files
after(function(){
  generatedFiles.forEach(function(filePath){
    try
    {
      fs.unlinkSync(filePath);
    } catch (err) {
      // Ignore error
    }
  });
  generatedFiles.length = 0;
});

// Generated a sample file for our testing
function createReadOnlyFile(){
  var fileName = 'Test' + Date.now();
  var filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, fileName);
  
  // Mark file permissions as readonly
  fs.chmodSync(filePath, '444');
  generatedFiles.push(filePath);
  return filePath;
}
