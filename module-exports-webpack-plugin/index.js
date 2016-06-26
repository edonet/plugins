'use strict';

var tpl = require('./template');

function ExportWebpackPlugin(name) {
    this.name = name;
}

ExportWebpackPlugin.prototype.apply = function(compiler) {
    var name = this.name;

    compiler.plugin('compilation', function(compilation){
        compilation.mainTemplate.plugin('startup', function(source, chunk) {
            var find = 'return __webpack_require__(0);',
                replace, rename;

            if (typeof name === 'string') {
                rename = name
                    .replace(/\[name\]/g, chunk.name)
                    .replace(/\[hash\]/g, chunk.hash);

                replace = tpl.named.replace('%name%', rename);
            } else {
                replace = tpl.unnamed;
            }

            return source.replace(find, replace);
        });
    });
};

module.exports = ExportWebpackPlugin;

