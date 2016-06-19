'use strict';

var tpl = require('./template');

function ExportWebpackPlugin(name) {
    this.name = name;
}

ExportWebpackPlugin.prototype.apply = function(compiler) {
    var name = this.name;

    compiler.plugin('compilation', function(compilation){
        compilation.mainTemplate.plugin('startup', function(source) {
            var find = 'return __webpack_require__(0);',
                replace = typeof name === 'string' ?
                        tpl.named.replace('%name%', name) : tpl.unnamed;

            return source.replace(find, replace);
        });
    });
};

module.exports = ExportWebpackPlugin;

