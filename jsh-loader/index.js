'use strict';

const KEYWORDS = ['break', 'do', 'instanceof', 'typeof', 'case', 'else', 'new', 'var', 'catch', 'finally',
        'return', 'void', 'continue', 'for', 'switch', 'while', 'debugger', 'function', 'this', 'with',
        'default', 'if', 'throw', 'delete', 'in', 'try', 'abstract', 'enum', 'int', 'short', 'boolean',
        'export', 'interface', 'static', 'byte', 'extends', 'long', 'super', 'char', 'final', 'native',
        'synchronized', 'class', 'float', 'package', 'throws', 'const', 'goto', 'private', 'transient',
        'implements', 'protected', 'volatile', 'double', 'import', 'public', 'let', 'yield', 'window',
        'document', 'location', 'history', 'console'];

/**
 * @method: 解析模板字符串
 * @param  [string] str: 需要解析模板字符串
 * @return [string]: 解析后的函数字符串
 */
function compile(source) {
    var left = '<%',
        right = '%>',
        indent = '\t',
        code = '',
        js = [],
        vari;

    source = String(source)

        // 去掉分隔符中js行注释
        .replace(new RegExp("(" + left + "[^" + right + "]*)//.*\n", "g"), "$1")

        // 把所有换行去掉  \r回车符 \t制表符 \n换行符
        .replace(new RegExp("[\\r\\t\\n]", "g"), "")

        // 去掉注释内容  <%* 这里可以任意的注释 *%>
        // 默认支持HTML注释，将HTML注释匹配掉的原因是用户有可能用 <! !>来做分割符
        .replace(new RegExp("<!--.*?-->", "g"), "")
        .replace(new RegExp(left + "\\*.*?\\*" + right, "g"), "")

        .split(right);


    // 遍历模板字符串
    for (let str of source) {
        str = str.split(left);
        var $1 = str[0].replace(/'/g, '\\\''),
            $2 = str[1];

        // 处理模板中的HTML代码
        code += `${indent}code += '${$1}';\n`;

        if ($2 && ($2 = $2.trim()) && $2 !== '=') {
            // 提取Javascript中的参数
            js.push($2);

            // 处理缩进
            if (/\}$/.test($2)) {
                indent = indent.substr(1);
            }

            // 处理模板中的Javascript代码
            code += `${indent}${logic($2)}\n`;

            if (/\{$/.test($2)) {
                indent += '\t';
            }
        }
    }

    indent = `,\n${indent}\t`;
    vari = getVariable(js.join('\n')).join(indent);


    return `
'use strict';

var utils = require('tpl-loader/utils');

module.exports = function (data) {
    var ${vari};

    ${code.replace(/\t+/, '')}
    return code;
}
    `;
}

/**
 * @method: 处理模板字符串中的Javascript代码
 * @param  [string] code: 需要处理的Javascript代码字符串
 * @return [string]: 处理后的代码字符串
 */
function logic(code) {
    if (code.indexOf('=') === 0) {
        code = code.replace(/^=\s+/, '');
        return `code += utils.encodeHTML(${code});`;
    } else {
        return code;
    }
}

/**
 * @method: 提取字符串中的Javascript变量
 * @param  [string] str: 需要提取的字符串
 * @return [array]: 提取出来的变量数组
 */
function getVariable(str) {
    str = str
        // 去除注解
        .replace(/\/\/.*?[\n\t\r]/g, '')
        .replace(/[\r\t\n]+/g, ' ')
        .replace(/\/\*.*?\*\//g, '')

        // 去除字符串
        .replace(/("|').*?\1/g, '')

        // 去除正则表达式
        .replace(/\/[^\/]+?\/\w+/g, '');

    var set = [],
        patt = str.match(/\bvar\s+(.*?);/g),
        code = ['code = \'\''];

    for (let value of patt) {
        value = value.replace(/var\s+/, '').split(/,\s+/).map(function (v) {
            return v.split(/[\s=]/)[0];
        });
        set = set.concat(value);
    }

    str = str

        // 去除函数
        .replace(/\w+\(/g, ' ')

        // 去除后代属性
        .replace(/\.[\w\.]+/g, ' ')

        // 去除数字
        .replace(/\b[\d\.]+\b/g, '')

        // 去除非单词字符
        .replace(/[^\w]+/g, ' ');


    str = new Set(str.trim().split(/\s+/));

    // 去除关键字
    for (let key of KEYWORDS) {
        if(str.has(key)){
            str.delete(key);
        }
    }

    // 去除定义的变量
    for (let key of set) {
        str.delete(key);
    }

    for (let value of str) {
        code.push(`${value} = data.${value}`);
    }

    return code;
}

// 抛出接口
module.exports = compile;
