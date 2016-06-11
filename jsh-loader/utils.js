'use strict';

/**
 * @method: HTML转义
 * @param  [string] source: 需要转义的源码
 * @return [string]: 转义后的代码
 */
function encodeHTML(source) {
    return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/\\/g,'&#92;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}
exports.encodeHTML = encodeHTML;
