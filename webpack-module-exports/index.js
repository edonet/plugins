'use strict';

var fs = require('fs'),
    find = 'return __webpack_require__(0);',
    replace = `
/******/    var output = __webpack_require__(0),
/******/        key;

/******/    if(typeof module !== 'undefined' && typeof exports === 'object'){
/******/        module.exports = output;
/******/    }else if(typeof define === 'function' && (define.amd || define.cmd)){
/******/        define(function(require, exports, module){
/******/            return module.exports = output;
/******/        });
/******/    }else{
/******/        for(key in output){
/******/            window[key] = output[key];
/******/        }
/******/    }`;


function ExportWebpackPlugin(options) {}

ExportWebpackPlugin.prototype.apply = function(compiler, callback) {

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
            chunks.forEach(function(chunk) {
                chunk.files.forEach(function(file) {
                    var asset = compilation.assets[file],
                        code = asset.source();

                    replaceWebpackAssetCode(asset, code);
                });
            });
            callback();
        });
    });
};

function replaceWebpackAssetCode(asset, code){
    asset._cachedSource = code.replace(find, replace);
}

module.exports = ExportWebpackPlugin;

