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
/******/\tvar __module_exports__ = __webpack_require__(0);

/******/\tif(typeof module !== 'undefined' && typeof exports === 'object'){
/******/\t\tmodule.exports = __module_exports__;
/******/\t}else if(typeof define === 'function' && (define.amd || define.cmd)){
/******/\t\tdefine(function(require, exports, module){
/******/\t\t\treturn module.exports = __module_exports__;
/******/\t\t})
/******/\t}else{
/******/\t\twindow.${name} = __module_exports__;
/******/\t};`;
    }else{
        return `
/******/\tvar __module_exports__ = __webpack_require__(0);

/******/\tif(typeof module !== 'undefined' && typeof exports === 'object'){
/******/\t\tmodule.exports = __module_exports__;
/******/\t}else if(typeof define === 'function' && (define.amd || define.cmd)){
/******/\t\tdefine(function(require, exports, module){
/******/\t\t\treturn module.exports = __module_exports__;
/******/\t\t});
/******/\t}else{
/******/\t\tfor(var key in __module_exports__){
/******/\t\t\twindow[key] = __module_exports__[key];
/******/\t\t}
/******/\t}`;
    }
}

module.exports = ExportWebpackPlugin;

