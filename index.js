'use strict'

var gutil = require('gulp-util');

module.exports = function(){
    var cp = require('child_process');
    return {
        clear: clearReadOnly
    };

    /**
     * Clear readOnly flag from all files and sub folders.
     * @name clearReadOnly
     * @param {string} path - Folder from which read-only flag needs to be cleared
     * @param {function} callback - Callback function to invoke
     * @param {boolean} isFile - Whether the path is a file. Default: False
     */
    function clearReadOnly(path, callback, isFile) {
        gutil.log('Clearing read-only flag for path:' + path + '...');
        var clearReadOnlyCommand = getCommand(path, !isFile);

        cp.exec(clearReadOnlyCommand, function(error) {
            // We only care about errors for this command
            if (error) {
                // Handle failure scenario
                gutil.log(error);
                throw new gutil.PluginError('clear:readonly',
                    'Failed to clear read only flag.');
            } else {
                // Mark this asynchronous task as completed
                gutil.log('Cleared read-only flag for path:' + path);
                // Invoke callback
                if (callback) {
                    callback();
                }
            }
        });
    }

    /**
     * Get clear command
     * @name getCommand
     * @param {string} path - Path from which read-only flag needs to be cleared
     * @param {boolean} isFile - Whether the specified path is a file. Default: Path is a folder
     */
    function getCommand(path, isFile) {
        if (/^win/.test(process.platform)) {
            // Is Windows
            if (isFile) {
                command = 'attrib -r "' + path + '\\*.*" /s';
            } else {
                command = 'attrib -r "' + path + '"';
            }
        } else {
            // Is Linux or Unix
            if (isFile) {
                // Check if file exists before executing command
                command = '[ -f "' + path + '" ] && chmod 777 "' + path + '" -f';
            } else {
                // Check if folder exists before executing command
                command = '[ -d "' + path + '" ] && chmod 777 "' + path + '" -f -R';
            }
        }
    }
};
