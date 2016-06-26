'use strict';

// 抛出接口
module.exports = function (source) {
    var regexp = /require\(('|")(.*?\.s?css)\1\)/g,
        fileList = [];

    // 替换【require('*.css')】代码
    source = source.replace(regexp, function (code, $1, $2) {
        fileList.push(`// @style: '${$2}';\n`);
        return '';
    });

    return fileList.join('') + '\n' + source
        // 替换【, ;】无效代码
        .replace(/(,|;)[\n\r\t\s,;]+(,|;)/g, ';');
};
