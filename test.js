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

it('should remove read only flag from a file', function(done){
  var file = createReadOnly();
  clearReadOnly(file, function(){
    fs.access(file, fs.W_OK, function(err) {
      assert.ok(!err);
      done();
    });
  }, { 
    isFile: true
  });
});

it('should remove read only flag from a folder', function(done){
  var folder = createReadOnly(true);
  clearReadOnly(folder, function(){
    fs.access(folder, fs.W_OK, function(err) {
      assert.ok(!err);
      done();
    });
  });
});


// Generated a sample file or folder for our testing
function createReadOnly(folder){
  var genPath = path.join(__dirname, 'test_' + Date.now() + (folder ? '_dir' : '_file'));
  if (folder) {
      fs.mkdirSync(genPath);
  } else {
      fs.writeFileSync(genPath, genPath);
  }
  
  // Mark file/folder permissions as readonly
  fs.chmodSync(genPath, '444');
  return genPath;
}


