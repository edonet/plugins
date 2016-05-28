'use strict';

function ExportWebpackPlugin(name) {
    this.name = name;
}

ExportWebpackPlugin.prototype.apply = function(compiler, callback) {
    var name = this.name;

    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("optimize-chunk-assets", function(chunks, callback) {
            chunks.forEach(function(chunk) {
                chunk.files.forEach(function(file) {
                    var asset = compilation.assets[file],
                        code = asset.source();

                    replaceWebpackAssetCode(asset, code, name);
                });
            });
            callback();
        });
    });
};

function replaceWebpackAssetCode(asset, code, name){
    var find = 'return __webpack_require__(0);',
        replace = getExportsReplaceContent(name);

    asset._cachedSource = code.replace(find, replace);
}

function getExportsReplaceContent(name){
    if(typeof name === 'string'){
        return `
/******/    var __module_exports__ = __webpack_require__(0);

/******/    if(typeof module !== 'undefined' && typeof exports === 'object'){
/******/        module.exports = __module_exports__;
/******/    }else if(typeof define === 'function' && (define.amd || define.cmd)){
/******/        define(function(require, exports, module){
/******/            return module.exports = __module_exports__;
/******/        })
/******/    }else{
/******/        window.${name} = __module_exports__;
/******/    };`;
    }else{
        return `
/******/    var __module_exports__ = __webpack_require__(0);

/******/    if(typeof module !== 'undefined' && typeof exports === 'object'){
/******/        module.exports = __module_exports__;
/******/    }else if(typeof define === 'function' && (define.amd || define.cmd)){
/******/        define(function(require, exports, module){
/******/            return module.exports = __module_exports__;
/******/        });
/******/    }else{
/******/        for(var key in __module_exports__){
/******/            window[key] = __module_exports__[key];
/******/        }
/******/    }`;
    }
}

module.exports = ExportWebpackPlugin;

