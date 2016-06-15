'use strict';

function ExportWebpackPlugin(name) {
    this.name = name;
}

ExportWebpackPlugin.prototype.apply = function(compiler) {
    var name = this.name;

    compiler.plugin('compilation', function(compilation){
        compilation.mainTemplate.plugin('startup', function(source) {
            var find = 'return __webpack_require__(0);',
                replace = getExportsReplaceContent(name);

            return source.replace(find, replace);
        });
    });
};

function getExportsReplaceContent(name){
    if(typeof name === 'string'){
        return `
var __module_exports__ = __webpack_require__(0);

if (typeof module !== 'undefined' && typeof exports === 'object') {
\tmodule.exports = __module_exports__;
} else if (typeof define === 'function' && (define.amd || define.cmd)) {
\tdefine(function (require, exports, module) {
\t\treturn module.exports = __module_exports__;
\t});
} else {
\twindow.${name} = __module_exports__;
};`;
    }else{
        return `
var __module_exports__ = __webpack_require__(0);

if (typeof module !== 'undefined' && typeof exports === 'object') {
\tmodule.exports = __module_exports__;
} else if (typeof define === 'function' && (define.amd || define.cmd)) {
\tdefine(function (require, exports, module) {
\t\treturn module.exports = __module_exports__;
\t});
} else {
\tfor (var key in __module_exports__) {
\t\tif (__module_exports__.hasOwnProperty(key)) {
\t\t\twindow[key] = __module_exports__[key];
\t\t}
\t}
}`;
    }
}

module.exports = ExportWebpackPlugin;

