var gutil = require('gulp-util');
var through = require('through2');
var path = require('path');
var PluginError = gutil.PluginError;

//consts
var PLUGIN_NAME = 'gulp-html-to-ts';

// html -> js processing functions:
// Remove bom when reading utf8 files
function stripBOM(str) {
    return 0xFEFF === str.charCodeAt(0)
        ? str.substring(1)
        : str;
}

// Transforms string to camelcase, to save valid name variable
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/[-._\s]+/g, '');
}


function html2Ts(config){
	var param = {};
	config = config || {};

	param.fileSrcType = config.fileSrcType || '.html';
	param.fileDestType = config.fileDestType || '.ts';
	param.tsTemplate =  config.tsTemplate || "module $folderName { export var $fileName = `$fileContent`;}";

	return through.obj( function( file, enc, done ) {
		if (file.isNull()) {
			done(null, file); //empty file
			return;
		}


		var fileName = camelize(path.basename(file.path, param.fileSrcType));
		if(!fileName){
			this.emit('error', new PluginError(PLUGIN_NAME, 'file <'+ file.path +'> not converted!'));
			return done();
		}

		var dirName = path.dirname(file.path);
		var folderName = camelize(path.basename(dirName));
		var content = stripBOM(file.contents.toString());

		content = param.tsTemplate
			.replace("$folderName", folderName)
			.replace("$fileName", fileName)
			.replace('$fileContent', content);

		if( file.isStream() ) {
			var stream = through();
			stream.write(content);

			stream.on('error', this.emit.bind(this, 'error'));

			file.contents = stream;
		}

		if( file.isBuffer() ) {
			file.contents = new Buffer( content );
		}

		file.path += param.fileDestType;
		this.push( file );

		return done();
	});
}

module.exports = html2Ts;
