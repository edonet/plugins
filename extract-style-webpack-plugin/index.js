'use strict';

var fs = require('fs'),
    path = require('path'),
    sass = require('node-sass'),
    moduleCache = {},
    sheetCache = {};

function ExtractStyleWebpackPlugin() {
    this.loader = path.join(__dirname, 'loader.js');
    this.package = path.resolve(__dirname, '../../');
}

ExtractStyleWebpackPlugin.prototype = {
    constructor: ExtractStyleWebpackPlugin,
    apply: function(compiler) {
        var resolve = compiler.options.resolve,
            self = this;

        // 初始化参数设置
        self.alias = resolve.alias || {};
        self.root = resolve.root || path.resolve(__dirname, '../');

        // 添加模块解析监听
        compiler.plugin('normal-module-factory', function(nmf) {
            nmf.plugin('after-resolve', function(data, callback) {

                // 添加过滤模块加载器
                if (data.request.substr(-3) === '.js') {
                    data.loaders.unshift(self.loader);
                }

                callback(null, data);
            });
        });

        // 添加资源解析监听
        compiler.plugin('compilation', function(compilation){
            var output = compiler.outputPath ?
                    path.resolve(compiler.context, compiler.outputPath) :
                    compiler.context;

            compilation.plugin('chunk-asset', function (chunk, name) {
                self.extract(path.resolve(output, name), chunk.modules);
            });
        });
    },
    extract: function (name, modules) {
        var src = path.resolve(this.package, name),
            deps = this.compile(modules);

        return deps.length && Promise.all(deps.map(function (dep) {

            // 如果不存在缓存，则生成
            if (!(dep in moduleCache)) {
                moduleCache[dep] = new Promise(function (resolve, reject) {
                    if (dep.substr(-5) === '.scss') {

                        // 经sass编译后输出
                        sass.render({
                          file: dep,
                          outputStyle: 'compact'
                        }, function(err, res) {
                            return err ? reject(err) : resolve(`/* @stylesheet: ${dep} */\n${res.css}`);
                        });

                    } else {

                        // 直接输出css文件
                        fs.readFile(dep, function (err, res) {
                            return err ? reject(err) : resolve(`/* @stylesheet: ${dep} */\n${res}`);
                        });

                    }
                });
            }

            return moduleCache[dep];
        })).then(function (res) {

            // 添加后缀名
            src = src.replace(/\.js$/, '') + '.css';

            // 输出文件
            fs.writeFile(src, res.join('\n'), function (err) {
                err && console.log('Extract style Error: ', err);
            });

        }, function (err) {
            console.log('Extract style Error: ', err);
        });
    },
    compile: function (modules) {
        var self = this,
            sheets = [];

        modules.forEach(function (module) {
            var name = module.request;

            if (!(name in sheetCache)) {
                sheetCache[name] = self.resolve(module);
            }

            for (let style of sheetCache[name]) {
                sheets.indexOf(style) === -1 && sheets.push(style);
            }
        });

        return sheets;
    },
    resolve: function (module) {
        if (!/\.js$/.test(module.request)) {
            return [];
        }

        var self = this,
            code = module._source._value,
            regexp = /\/\/ @style: '(.+?)';/g,
            sheets = [],
            patt;

        self.context = module.context;

        while (patt = regexp.exec(code)) {
            sheets.push(self.path(patt[1]));
        }

        return sheets;
    },
    path: function (src) {

        // 替换路径中的简写
        for (let name in this.alias) {
            if (src === name || src.indexOf(name + '/') === 0) {
                return this.path(src.replace(name, this.alias[name]));
            }
        }

        switch (src[0]) {

            // 相对当前路径
            case '.':
                return path.resolve(this.context, src);

            // 相对包路径
            case '/':
                return path.resolve(this.package, src);

            // 绝对路径
            default:
                return path.resolve(this.root, src);
        }
    }
};

// 抛出接口
module.exports = ExtractStyleWebpackPlugin;
