'use strict';

/**
 * @method: 解析模板字符串
 * @param  [string] str: 需要解析模板字符串
 * @return [string]: 解析后的函数字符串
 */
function compile(source) {
    source = source.replace(/\s*[\r\t\n]+\s*/g, '').replace(/\'/g, '\\\'');

    return `
'use strict';

require('jsc-loader/utils')('${source}');
    `;
}

// 抛出接口
module.exports = compile;
