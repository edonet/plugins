'use strict';

var gutil = require('gulp-util'),
    through = require('through2'),
    jsh = require('jsh-loader'),
    xss = require('jsh-loader/xss').toString();

module.exports = function (options) {

    // 初始化参数设置
    options = options || {};

    return through.obj(function (file, enc, cb) {

        // 非文件异常处理
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        // 流文件异常处理
        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-jsh', 'Streaming not supported'));
            return;
        }

        // 处理文件流
        new Promise(function (resolve, reject) {
            try {

                // 编译内容
                let code = jsh(file.contents.toString());

                // 替换代码中的xss方法
                code = code
                    .replace('require(\'jsh-loader/xss\')', 'xss');

                // 合并代码
                code = `${code}\n\n${xss}`;

                // 如果是CMD模块
                if (options.cmd) {

                    // 添加代码缩进
                    code = code
                        .replace(/([\n\r])/g, '$1\t');

                    // 合并代码
                    code = `define(function(require, exports, module){\n\n\t${code}\n\n});`;
                }

                // 返回编译结果
                resolve(code);

             } catch(e) {

                // 返回错误
                reject(new gutil.PluginError('gulp-jsh', e))
             }

        }).then(function (res) {

            // 生成编译后的文件内容
            file.contents = new Buffer(res);

            // 返回编译后的文件
            setImmediate(cb, null, file);

        }, function (err) {

            // 抛出异常错误
            setImmediate(cb, new gutil.PluginError('gulp-jsh', err, {
                fileName: file.path
            }));

        });
    });
};
