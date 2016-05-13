function ModuleMapWebpackPlugin(options) {}

ModuleMapWebpackPlugin.prototype.apply = function(compiler) {
    compiler.plugin('emit', function(compilation, callback) {
        var map = {},
            md = {};

        compilation.entries.forEach(function (entry) {
            map[entry.name] = (function walk(deps){
                if(!deps.length)
                    return null;

                var m = {}, i = 0;

                deps.forEach( function(dep) {
                    if(!dep.module) return null;
                    i ++;
                    m[dep.module.request] = walk(dep.module.dependencies);
                });

                return i ? m : null;
            })(entry.dependencies);
        });

        compilation.modules.forEach(function (module) {
             if(module.request){
                var deps = [];
                module.dependencies.forEach(function (dep) {
                    dep.module && deps.push(dep.module.request);
                });
                md[module.request] = deps.length ? deps : null;
             }
        });

        require('fs').writeFile('webpack.map.json', JSON.stringify({map: map, modules: md}, null, 4), function(err){
            err && console.log('Export module map Error: ' + err);
        });

        callback();
    });
};

module.exports = ModuleMapWebpackPlugin;
