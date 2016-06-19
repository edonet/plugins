/**
 * 命名模块扩展模板
 */
exports.named = `
var __module_exports__ = __webpack_require__(0);

if (typeof module !== 'undefined' && typeof exports === 'object') {
\tmodule.exports = __module_exports__;
} else if (typeof define === 'function' && (define.amd || define.cmd)) {
\tdefine(function (require, exports, module) {
\t\treturn module.exports = __module_exports__;
\t});
} else {
\twindow.%name% = __module_exports__;
}`;


/**
 * 无命名模块扩展模板
 */
exports.unnamed = `
var __module_exports__ = __webpack_require__(0);

if (typeof module !== 'undefined' && typeof exports === 'object') {
\tmodule.exports = __module_exports__;
} else if (typeof define === 'function' && (define.amd || define.cmd)) {
\tdefine(function (require, exports, module) {
\t\treturn module.exports = __module_exports__;
\t});
} else {
\tfor (var key in __module_exports__) {
\t\tif (__module_exports__.hasOwnProperty(key)) {
\t\t\twindow[key] = __module_exports__[key];
\t\t}
\t}
}`;
