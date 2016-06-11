'use strict';

var wrapper = null,
    appendStyle;

/**
 * @method: 动态加载css样式
 * @param  [string] str: 需要解析模板字符串
 * @return [string]: 解析后的函数字符串
 */
function loadStyle(source) {
    if (typeof document === 'undefined') {
        console.log(source);
    } else {
        if (wrapper === null) {
            wrapper = document.createElement('style');
            wrapper.type = 'text/css';

            appendStyle = wrapper.styleSheet ? function (code) {
                wrapper.styleSheet.cssText += code;
            } : function (code) {
                wrapper.textContent += code;
            };

            appendStyle(source);
            document.getElementsByTagName('head')[0].appendChild(wrapper);
        } else {
            appendStyle(source);
        }
    }
}

// 抛出接口
module.exports = loadStyle;
