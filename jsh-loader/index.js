'use strict';

const KEYWORDS = ['break', 'do', 'instanceof', 'typeof', 'case', 'else', 'new', 'var', 'catch', 'finally',
        'return', 'void', 'continue', 'for', 'switch', 'while', 'debugger', 'function', 'this', 'with',
        'default', 'if', 'throw', 'delete', 'in', 'of', 'try', 'abstract', 'enum', 'int', 'short', 'boolean',
        'export', 'interface', 'static', 'byte', 'extends', 'long', 'super', 'char', 'final', 'native',
        'synchronized', 'class', 'float', 'package', 'throws', 'const', 'goto', 'private', 'transient',
        'implements', 'protected', 'volatile', 'double', 'import', 'public', 'let', 'yield', 'window',
        'document', 'location', 'history', 'console', 'locals'];

// 模板生成函数
var jsh =  function (locals) {

    var __xss = require('jsh-loader/xss'),
        __s;

    __s = __xss(locals);

    return __s;
}

// 抛出接口
module.exports = function (source) {
    var level = 1,
        js = [];

    source = source

        // 去除注解
        .replace(/<!--.*?-->/g, '')

        // 去除标签中的换行
        .replace(/>\s+</g, '><')

        // 分离代码段
        .split('%>')

        // 遍历代码片段
        .map(function (code) {
            var $1, $2, indent;

            // 分离html和js
            code = code.split('<%');

            // 转义html中的【'】且去除换行的空格
            if ($1 = code[0].trim()) {
                $1 = $1.replace(/'/g, '\\\'').replace(/\s*[\r\n]\s*/g, ' ');
            }

            if ('1' in code && ($2 = compile(code[1].trim()))) {

                // 降低缩进等级
                if ($2[0] === '}') {
                    level --;
                }

                indent = '\t'.repeat(level);

                // 添加缩进等级
                if ($2.substr(0, 3) !== '__s') {
                    if ($2[0] === '}') {
                        $2 = indent + $2.replace(/;\s*/g, ';\n' + indent);
                    } else {
                        $2 = '\n' + indent + $2.replace(/;\s*/g, ';\n' + indent);
                    }
                } else {
                    $2 =  indent + $2;
                }

                // 提高缩进等级
                if ($2.substr(-1) === '{') {
                    level ++;
                }

                // 收集js片段
                js.push($2);

                return `${$1}';\n${$2}\n${'\t'.repeat(level)}__s += '`;
            }

            return $1;
        })

        // 合并代码片段
        .join('')


        // 去除多余的空代码
        .replace(/[\r\n\t]*__s \+= '';/g, '')

        // 去除首尾空白
        .trim();


    // 获取变量列表
    if ((js = collect(js.join(''))).length) {
        js = js.push('') && js.join(',\n' + '\t'.repeat(level + 1));
    } else {
        js = '';
    }

    return '\'use strict\';\n\nmodule.exports = ' + jsh

        // 生成模板函数
        .toString()

        // 替换xss模块路径
        .replace('var ', `var ${js}`)

        // 替换模板代码
        .replace('__xss(locals)', `'${source}'`);
}


// 编译js代码
function compile(code) {
    if (!code || code === '-' || code === '=') {
        return '';
    }

    code = code

        // 去除js多行注解
        .replace(/\/\*[\S\s]*?\*\//g, ' ')

        // 去除js行内注解
        .replace(/\/\/.*/g, '')

        // 去除js换行
        .replace(/\s*[\r\n]\s*/g, ' ');


    // 输出类型
    switch (code[0]) {
        case '-':
            // 输出转义字符
            return `__s += __xss(${code.substr(1).trim()});`;
        case '=':
            // 输出原字符
            return `__s += ${code.substr(1).trim()};`;
        default:
            // js处理
            return code;
    }
}

// 采集js代码中的变量
function collect(code) {
    code = code

        // 去除数字
        .replace(/\b\d+\b/g, '')

        // 去除字符串
        .replace(/("|').*?\1/g, '')

        // 去除正则表达式
        .replace(/\/[^\/]+?\/\w+/g, '')

        // 去除函数
        .replace(/\w+\(/g, '')

        // 去除对象属性
        .replace(/(\.\w+)+/g, ' ')

        // 去除私有变量
        .replace(/__s/g, '')
        .replace(/__xss/g, '');

    var patt = /var\s+(.+?);/g,
        vari = [],
        match;

    // 提取代码中的变量
    while (match = patt.exec(code)) {
        match[1].split(/,\s*/).forEach(function (v) {
            if (v = v.match(/^\w+/)) {
                vari.push(v[0]);
            }
        });
    }

    code = code

        // 替换非单词字符
        .replace(/[^\w]+/g, ' ')

        // 去除首尾空白
        .trim()

        // 分割成单词
        .split(' ');

    vari = new Set(vari);
    code = new Set(code);
    match = [];

    // 去除关键字
    for (let key of KEYWORDS) {
        code.has(key) && code.delete(key);
    }

    // 去除自定义的变量
    for (let key of vari) {
        code.delete(key);
    }

    // 生成变量代码
    for (let value of code) {
        value && match.push(`${value} = locals.${value}`);
    }


    return match;
}


