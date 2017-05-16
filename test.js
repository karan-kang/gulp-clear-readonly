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
  var path;
  var name = 'Test' + Date.now();
  var path = path.join(__dirname, name);
  if (folder) {
      path = path + '_dir';
      fs.mkdirSync(path);
  } else {
      path = path + '_file';
      fs.writeFileSync(path, path);
  }
  
  // Mark file/folder permissions as readonly
  fs.chmodSync(path, '444');
  return path;
}


