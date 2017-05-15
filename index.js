var gutil = require('gulp-util');
var cp = require('child_process');
var moduleName = 'gulp-clear-readonly';
var debug = gutil.log;

/**
 * Clear readOnly flag from all files and sub folders.
 * @name clearReadOnly
 * @param {string} path - Folder from which read-only flag needs to be cleared
 * @param {function} callback - Callback function to invoke
 * @param {Object} opts - Plugin options { isFile, debug }
 * @return {Object} callback result if any
 */
function clearReadOnly(path, callback, providedOptions) {
	var options = getOptions(providedOptions);
	debug = options.debug ? gutil.log : function () {};
	debug(moduleName, 'Clearing read-only flag for path: ' + path + '...');

	var callbackResult;
	var clearReadOnlyCommand = getCommand(path, options.isFile);
	try {
		cp.execSync(clearReadOnlyCommand);
		// Mark this asynchronous task as completed
		debug(moduleName, 'Cleared read-only flag for path: ' + path);
	} catch (error) {
		// Handle failure scenario
		debug(moduleName, error);
		throw new gutil.PluginError(moduleName, 'Failed to clear read only flag.');
	}

	if (typeof(callback) == 'function') {
		try {
			callbackResult = callback();
		} catch (error) {
			debug(moduleName, error);
			throw new gutil.PluginError(moduleName, 'An error occurred while trying to execute callback.');
		}
	}

	return callbackResult;
}

/**
 * Get clear read-only flag command
 * @name getCommand
 * @param {string} path - Path from which read-only flag needs to be cleared
 * @param {boolean} isFile - Whether the specified path is a file. Default: Path is a folder
 * @return {string} Clear read-only flag command
 */
function getCommand(path, isFile) {
	var command;
	if (/^win/.test(process.platform)) {
		debug(moduleName, 'Detected platform: Windows');

		// Is Windows
		if (isFile) {
			command = 'attrib -r "' + path + '\\*.*" /s';
		} else {
			command = 'attrib -r "' + path + '"';
		}
	} else {
		debug(moduleName, 'Detected platform: Non-Windows');
		
		// Is Linux or Unix
		command = 'mkdir -p "' + path + '" && chmod 777 "' + path + '" -f -R';
	}

	debug(moduleName, 'Command: ' + command);
	return command;
}

/**
 * Merge provided options with default options
 * @name getCommand
 * @param {object} options - Plugin options
 * @return {object} Merged options
 */
function getOptions(options) {
	options = options || {};
	options.isFile = 'isFile' in options ? options.isFile : false;
	options.debug = 'debug' in options ? options.debug : false;
	return options;
}

// Export this module
module.exports = clearReadOnly;
