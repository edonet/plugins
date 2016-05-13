'use strict';
var through = require('through2'),
    gutil = require('gulp-util');

module.exports = function(handler){
    return through.obj(function(file, enc, callback){
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return callback();
        }

        if(handler && handler.call(this, file, enc, callback) !== false){
            this.push(file);
            callback();
        }
    });
}
