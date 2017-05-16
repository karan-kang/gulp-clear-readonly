'use strict'

const assert = require('assert');
const gutil = require('gulp-util');
const dirPath = __dirname;
const fs = require("fs");
const path = require("path");
const clearReadOnly = require('./');
let genPathIndex = 0;

it('should run on travis', function(){
  assert.ok(true);
});

it('should remove read only flag from a file', function(done){
  const file = createReadOnly();
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
  const folder = createReadOnly(true);
  clearReadOnly(folder, function(){
    fs.access(folder, fs.W_OK, function(err) {
      assert.ok(!err);
      done();
    });
  });
});

it('should handle non existing folder', function(done){
  const folder = generatePath(true) + '_DNE';
  clearReadOnly(folder, function(){
      assert.ok(true);
      done();
  });
});

it('should handle non existing file', function(done){
  const file = generatePath() + '_DNE';
  clearReadOnly(file, function(){
      assert.ok(true);
      done();
  });
});

// Generate a one time path for use during testing
function generatePath(folder){
  return path.join(__dirname, 'test_' + Date.now() + String(genPathIndex++) + (folder ? '_dir' : '_file'));
}

// Generated a sample file or folder for our testing
function createReadOnly(folder){
  const genPath = generatePath(folder);
  if (folder) {
      fs.mkdirSync(genPath);
  } else {
      fs.writeFileSync(genPath, genPath);
  }
  
  // Mark file/folder permissions as readonly
  fs.chmodSync(genPath, '444');
  return genPath;
}


