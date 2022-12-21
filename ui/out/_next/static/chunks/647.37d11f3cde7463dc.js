"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[647],{

/***/ 9647:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Color": function() { return /* binding */ Color; },
/* harmony export */   "ColoredStreak": function() { return /* binding */ ColoredStreak; }
/* harmony export */ });
/* harmony import */ var snarkyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6400);

/**
 * we choose to represent colors as a single number
 * that is just the decimal representation of its hex value
 */
class Color extends snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN {
    constructor(value) {
        super((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(value));
    }
    static hexToFields(color) {
        return new Color(Number.parseInt(color, 16));
    }
    static noColor() {
        if (Color.NO_COLOR == null) {
            Color.NO_COLOR = new Color((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(-1));
        }
        return Color.NO_COLOR;
    }
}
class ColoredStreak extends (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Struct */ .AU)({
    color: Color,
    length: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN,
}) {
}
//# sourceMappingURL=types.js.map

/***/ })

}]);