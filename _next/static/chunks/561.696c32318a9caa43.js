"use strict";
(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[561,247,106,647],{

/***/ 4756:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": function() { return /* binding */ DynamicArray; }
/* harmony export */ });
/* harmony import */ var snarkyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6400);
/**
 * Copied from https://github.com/gretzke/zkApp-data-types/blob/main/src/dynamicArray.ts
 * Which is provided under Apache 2 license by Daniel Gretzke
 */


// type HashableProvable<T> = Provable<T> & {
//   hash(x: T): Field;
//   equals(x: T, other: T): Bool;
// };
// function hashable<T>(type: Provable<T>): HashableProvable<T> {
//   return {
//     ...type,
//     hash(x: T): Field {
//       return Poseidon.hash(type.toFields(x));
//     },
//     equals(x: T, other: T): Bool {
//       return this.hash(x).equals(this.hash(other));
//     },
//   };
// }
function DynamicArray(type, maxLength) {
    // const _type = hashable(type);
    function Null() {
        return type.fromFields(Array(type.sizeInFields()).fill((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0)), type.toAuxiliary());
    }
    return class _DynamicArray extends (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Struct */ .AU)({
        length: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN,
        values: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit.array */ .dx.array(type, maxLength),
    }) {
        //   static from(values: T[]): _DynamicArray {
        //     return new _DynamicArray(values);
        //   }
        //   static empty(length?: Field): _DynamicArray {
        //     const arr = new _DynamicArray();
        //     arr.length = length ?? Field(0);
        //     return arr;
        //   }
        constructor(values) {
            super({
                values: fillWithNull(values ?? [], maxLength),
                length: values === undefined ? (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0) : (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(values.length),
            });
        }
        get(index) {
            const mask = this.indexMask(index);
            return snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["switch"] */ .dx["switch"](mask, type, this.values);
        }
        set(index, value) {
            const mask = this.indexMask(index);
            for (let i = 0; i < this.maxLength(); i++) {
                this.values[i] = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["switch"] */ .dx["switch"]([mask[i], mask[i].not()], type, [
                    value,
                    this.values[i],
                ]);
            }
        }
        // public push(value: T): void {
        //   this.incrementLength(Field(1));
        //   this.set(this.length.sub(1), value);
        // }
        pop(n) {
            const mask = this.lengthMask(this.length.sub(n));
            this.decrementLength(n);
            for (let i = 0; i < this.maxLength(); i++) {
                this.values[i] = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["switch"] */ .dx["switch"]([mask[i], mask[i].not()], type, [
                    this.values[i],
                    Null(),
                ]);
            }
        }
        //   public concat(other: this): this {
        //     const newArr = other.copy();
        //     newArr.shiftRight(this.length);
        //     let masked = Bool(true);
        //     for (let i = 0; i < this.maxLength(); i++) {
        //       masked = Circuit.if(Field(i).equals(this.length), Bool(false), masked);
        //       newArr.values[i] = Circuit.if(masked, this.values[i], newArr.values[i]);
        //     }
        //     return newArr;
        //   }
        //   public copy(): this {
        //     const newArr = new (<any>this.constructor)();
        //     newArr.values = this.values.slice();
        //     newArr.length = this.length;
        //     return newArr;
        //   }
        //   public slice(start: Field, end: Field): this {
        //     const newArr = this.copy();
        //     newArr.shiftLeft(start);
        //     newArr.pop(newArr.length.sub(end.sub(start)));
        //     return newArr;
        //   }
        //   public insert(index: Field, value: T): void {
        //     const arr1 = this.slice(Field(0), index);
        //     const arr2 = this.slice(index, this.length);
        //     arr2.shiftRight(Field(1));
        //     arr2.set(Field(0), value);
        //     const concatArr = arr1.concat(arr2);
        //     this.values = concatArr.values;
        //     this.length = concatArr.length;
        //   }
        //   public includes(value: T): Bool {
        //     let result = Field(0);
        //     for (let i = 0; i < this.maxLength(); i++) {
        //       result = result.add(
        //         Circuit.if(_type.equals(this.values[i], value), Field(1), Field(0))
        //       );
        //     }
        //     return result.equals(Field(0)).not();
        //   }
        //   public assertIncludes(value: T): void {
        //     this.includes(value).assertTrue();
        //   }
        //   public shiftLeft(n: Field): void {
        //     n.equals(this.length).assertFalse();
        //     this.decrementLength(n);
        //     const nullArray = _DynamicArray.empty(n);
        //     const possibleResults = [];
        //     const mask = [];
        //     for (let i = 0; i < this.maxLength(); i++) {
        //       possibleResults[i] = this.values
        //         .slice(i, this.maxLength())
        //         .concat(nullArray.values.slice(0, i));
        //       mask[i] = Field(i).equals(n);
        //     }
        //     const result = [];
        //     for (let i = 0; i < this.maxLength(); i++) {
        //       const possibleFieldsAtI = possibleResults.map((r) => r[i]);
        //       result[i] = Circuit.switch(mask, type, possibleFieldsAtI);
        //     }
        //     this.values = result;
        //   }
        //   public shiftRight(n: Field): void {
        //     const nullArray = _DynamicArray.empty(n);
        //     this.incrementLength(n);
        //     const possibleResults = [];
        //     const mask = [];
        //     for (let i = 0; i < this.maxLength(); i++) {
        //       possibleResults[i] = nullArray.values
        //         .slice(0, i)
        //         .concat(this.values.slice(0, this.maxLength() - i));
        //       mask[i] = Field(i).equals(nullArray.length);
        //     }
        //     const result = [];
        //     for (let i = 0; i < this.maxLength(); i++) {
        //       const possibleFieldsAtI = possibleResults.map((r) => r[i]);
        //       result[i] = Circuit.switch(mask, type, possibleFieldsAtI);
        //     }
        //     this.values = result;
        //   }
        //   public hash(): Field {
        //     return Poseidon.hash(this.values.map((v) => type.toFields(v)).flat());
        //   }
        maxLength() {
            return maxLength;
        }
        //   public toString(): string {
        //     return this.values.slice(0, parseInt(this.length.toString())).toString();
        //   }
        indexMask(index) {
            const mask = [];
            let lengthReached = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Bool */ .tW)(false);
            for (let i = 0; i < this.maxLength(); i++) {
                lengthReached = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(i).equals(this.length).or(lengthReached);
                const isIndex = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(i).equals(index);
                // assert index < length
                // isIndex.and(lengthReached).not().assertTrue();
                mask[i] = isIndex;
            }
            return mask;
        }
        incrementLength(n) {
            const newLength = this.length.add(n);
            // assert length + n <= maxLength
            // let lengthLteMaxLength = Bool(false);
            // for (let i = 0; i < this.maxLength() + 1; i++) {
            //   lengthLteMaxLength = lengthLteMaxLength.or(Field(i).equals(newLength));
            // }
            // lengthLteMaxLength.assertTrue();
            this.length = newLength;
        }
        decrementLength(n) {
            this.length = this.length.sub(n);
            // make sure length did not underflow
            // let newLengthFound = Bool(false);
            // for (let i = 0; i < this.maxLength() + 1; i++) {
            //   newLengthFound = newLengthFound.or(Field(i).equals(this.length));
            // }
            // newLengthFound.assertTrue();
        }
        lengthMask(n) {
            const mask = [];
            let masked = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Bool */ .tW)(true);
            for (let i = 0; i < this.maxLength(); i++) {
                masked = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"]((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(i).equals(n), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Bool */ .tW)(false), masked);
                mask[i] = masked;
            }
            return mask;
        }
    };
    function fillWithNull([...values], length) {
        for (let i = values.length; i < length; i++) {
            values[i] = Null();
        }
        return values;
    }
}
//# sourceMappingURL=dynamic.js.map

/***/ }),

/***/ 9905:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "d": function() { return /* binding */ gameInfo; }
/* harmony export */ });
const gameInfo = {
    rows: [
        [
            { color: '16553247', length: 1 },
            { color: '16553247', length: 1 },
            { color: '16553247', length: 2 },
            { color: '142913', length: 2 },
        ],
        [
            { color: '16553247', length: 1 },
            { color: '142913', length: 1 },
            { color: '16553247', length: 1 },
            { color: '16553247', length: 1 },
        ],
        [{ color: '16553247', length: 1 }],
        [
            { color: '16553247', length: 2 },
            { color: '142913', length: 2 },
            { color: '16553247', length: 1 },
            { color: '16553247', length: 1 },
        ],
        [
            { color: '16553247', length: 1 },
            { color: '142913', length: 1 },
            { color: '16553247', length: 1 },
            { color: '142913', length: 2 },
        ],
    ],
    columns: [
        [
            { color: '16553247', length: 1 },
            { color: '16553247', length: 2 },
        ],
        [{ color: '16553247', length: 1 }],
        [
            { color: '16553247', length: 2 },
            { color: '142913', length: 1 },
            { color: '16553247', length: 1 },
        ],
        [
            { color: '142913', length: 1 },
            { color: '142913', length: 2 },
        ],
        [{ color: '16553247', length: 1 }],
        [{ color: '16553247', length: 2 }],
        [{ color: '16553247', length: 2 }],
        [{ color: '142913', length: 1 }],
        [
            { color: '142913', length: 1 },
            { color: '142913', length: 1 },
        ],
        [
            { color: '16553247', length: 1 },
            { color: '16553247', length: 1 },
            { color: '142913', length: 1 },
        ],
    ],
};
//# sourceMappingURL=input.js.map

/***/ }),

/***/ 3106:
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async function (__webpack_handle_async_dependencies__, __webpack_async_result__) { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ColumnClass": function() { return /* binding */ ColumnClass; },
/* harmony export */   "NonogramSubmission": function() { return /* binding */ NonogramSubmission; },
/* harmony export */   "RowClass": function() { return /* binding */ RowClass; },
/* harmony export */   "SolutionNonogram": function() { return /* binding */ SolutionNonogram; },
/* harmony export */   "circuitGameInfo": function() { return /* binding */ circuitGameInfo; }
/* harmony export */ });
/* harmony import */ var snarkyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6400);
/* harmony import */ var _dynamic_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4756);
/* harmony import */ var _input_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9905);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9647);




await snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .isReady */ .DK;
function jsonToStreakInfo(json) {
    return {
        rows: json.rows.map((row) => row.map((streak) => ({
            color: new _types_js__WEBPACK_IMPORTED_MODULE_3__.Color(streak.color),
            length: (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(streak.length),
        }))),
        columns: json.columns.map((column) => column.map((streak) => ({
            color: new _types_js__WEBPACK_IMPORTED_MODULE_3__.Color(streak.color),
            length: (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(streak.length),
        }))),
    };
}
const circuitGameInfo = jsonToStreakInfo(_input_js__WEBPACK_IMPORTED_MODULE_2__/* .gameInfo */ .d);
const RowClass = (0,_dynamic_js__WEBPACK_IMPORTED_MODULE_1__/* .DynamicArray */ .S)(_types_js__WEBPACK_IMPORTED_MODULE_3__.ColoredStreak, _input_js__WEBPACK_IMPORTED_MODULE_2__/* .gameInfo.rows.length */ .d.rows.length);
const ColumnClass = (0,_dynamic_js__WEBPACK_IMPORTED_MODULE_1__/* .DynamicArray */ .S)(_types_js__WEBPACK_IMPORTED_MODULE_3__.ColoredStreak, _input_js__WEBPACK_IMPORTED_MODULE_2__/* .gameInfo.columns.length */ .d.columns.length);
/**
 * Note: a Nonogram may have multiple solutions
 * https://math.stackexchange.com/a/1473350
 *
 * Therefore, we need the solution to consider the validity of a solution based off the row & column descriptions
 * and not the hash of the final image desired
 */
class SolutionNonogram extends (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Struct */ .AU)({
    rows: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit.array */ .dx.array(RowClass, _input_js__WEBPACK_IMPORTED_MODULE_2__/* .gameInfo.rows.length */ .d.rows.length),
    columns: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit.array */ .dx.array(ColumnClass, _input_js__WEBPACK_IMPORTED_MODULE_2__/* .gameInfo.columns.length */ .d.columns.length),
}) {
    static fromJS(nonogram) {
        const circuitRows = [];
        for (const row of nonogram.rows) {
            const arr = new RowClass(row);
            circuitRows.push(arr);
        }
        const circuitColumns = [];
        for (const column of nonogram.columns) {
            const arr = new ColumnClass(column);
            circuitColumns.push(arr);
        }
        return new SolutionNonogram({ rows: circuitRows, columns: circuitColumns });
    }
    static fromCircuit(nonogram) {
        return new SolutionNonogram({
            rows: nonogram.rows,
            columns: nonogram.columns,
        });
    }
    hash() {
        return snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Poseidon.hash */ .jm.hash([
            // encode length in hash to avoid MxN giving the same hash as a NxM
            (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(this.rows.length),
            (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(this.columns.length),
            ...this.rows.flatMap((row) => [
                row.length,
                ...row.values.flatMap((v) => [v.color, v.length]),
            ]),
            ...this.columns.flatMap((column) => [
                column.length,
                ...column.values.flatMap((v) => [v.color, v.length]),
            ]),
        ]);
    }
}
class NonogramSubmission extends (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Struct */ .AU)({
    value: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit.array */ .dx.array(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit.array */ .dx.array(_types_js__WEBPACK_IMPORTED_MODULE_3__.Color, _input_js__WEBPACK_IMPORTED_MODULE_2__/* .gameInfo.columns.length */ .d.columns.length), _input_js__WEBPACK_IMPORTED_MODULE_2__/* .gameInfo.rows.length */ .d.rows.length),
}) {
    static from(value) {
        return new NonogramSubmission({
            value,
        });
    }
}
//# sourceMappingURL=ioTypes.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

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

/***/ }),

/***/ 6561:
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async function (__webpack_handle_async_dependencies__, __webpack_async_result__) { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NonogramZkApp": function() { return /* reexport safe */ _new_index__WEBPACK_IMPORTED_MODULE_0__.u; }
/* harmony export */ });
/* harmony import */ var _new_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(188);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_new_index__WEBPACK_IMPORTED_MODULE_0__]);
_new_index__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


//# sourceMappingURL=index.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 8864:
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async function (__webpack_handle_async_dependencies__, __webpack_async_result__) { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": function() { return /* binding */ NewNonogramZkApp; }
/* harmony export */ });
/* harmony import */ var snarkyjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6400);
/* harmony import */ var _common_input_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9905);
/* harmony import */ var _common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3106);
/* harmony import */ var _common_types_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9647);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__]);
_common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




await snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .isReady */ .DK;
function checkRowCircuit(row, noColor, streaks) {
    let streakIndex = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(-1);
    let currentRun = {
        color: noColor,
        left: (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0),
    };
    for (let j = 0; j < row.length; j++) {
        const matchCurrentColor = row[j].equals(currentRun.color);
        const isNoColor = row[j].equals(noColor);
        // matchCurrentColor = true
        {
            const ignoreBranch = matchCurrentColor.not();
            const lengthChange = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](ignoreBranch.or(currentRun.color.equals(noColor)), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(1));
            // note: we don't actually need to check currentRun.left here
            // as it's already checked for us either in the `matchCurrentColor = false` case or when the function terminates
            // currentRun.left.gte(lengthChange).or(ignoreBranch).assertTrue();
            currentRun.left = currentRun.left.sub(lengthChange);
        }
        // matchCurrentColor = false
        {
            const ignoreBranch = matchCurrentColor;
            currentRun.left.equals(0).or(ignoreBranch).assertTrue();
            streakIndex = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](isNoColor.or(ignoreBranch), streakIndex, streakIndex.add(1));
            const adjustedIndex = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](streakIndex.equals(-1), (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0), streakIndex);
            const nextStreak = streaks.get(adjustedIndex);
            // either it's a no color, or the 1st color of the next streak
            isNoColor
                .or(row[j].equals(nextStreak.color))
                .or(ignoreBranch)
                .assertTrue();
            const match = [
                ignoreBranch,
                ignoreBranch.not().and(isNoColor),
                ignoreBranch.not().and(isNoColor.not()),
            ];
            currentRun = {
                color: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["switch"] */ .dx["switch"](match, _common_types_js__WEBPACK_IMPORTED_MODULE_3__.Color, [
                    currentRun.color,
                    noColor,
                    nextStreak.color,
                ]),
                left: snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["switch"] */ .dx["switch"](match, _common_types_js__WEBPACK_IMPORTED_MODULE_3__.Color, [
                    currentRun.left,
                    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(0),
                    nextStreak.length.sub(1),
                ]),
            };
        }
    }
    // either we've seen all constraints, or there weren't any to begin with
    // note: this works on empty streaks because streakIndex is initialized as -1
    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(streakIndex).equals(streaks.length.sub(1)).assertTrue();
    currentRun.left.equals(0).assertTrue();
}
/**
 * Here is a JS implementation of the above circuit in case it helps with readability
 */
// function checkRowJS(row: Color[], noColor: Color, streaks: ColoredStreak[]) {
//   let streakIndex = -1;
//   let currentRun = {
//     color: noColor,
//     left: 0,
//   };
//   for (let j = 0; j < gameInfo.columns.length; j++) {
//     if (row[j].equals(currentRun.color)) {
//       if (currentRun.color.equals(noColor)) {
//         continue;
//       }
//       if (currentRun.left <= 0) {
//         throw new Error('error');
//       }
//       currentRun.left--;
//     } else {
//       if (currentRun.left !== 0) {
//         throw new Error('error');
//       }
//       if (row[j].equals(noColor)) {
//         currentRun = {
//           color: noColor,
//           left: 0,
//         };
//       } else {
//         streakIndex++;
//         let expectedStreak = streaks[streakIndex];
//         if (!row[j].equals(expectedStreak.color)) {
//           throw new Error('error');
//         }
//         currentRun = {
//           color: expectedStreak.color,
//           left: Number(expectedStreak.length.toBigInt()) - 1,
//         };
//       }
//     }
//   }
//   if (streakIndex !== streaks.length - 1) {
//     throw new Error('error');
//   }
//   if (currentRun.left !== 0) {
//     throw new Error('error');
//   }
// }
const expectedHash = _common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__.SolutionNonogram.fromJS(_common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__.circuitGameInfo).hash();
console.log(`Generating zkApp for hash ${expectedHash.toBigInt()}`);
class NewNonogramZkApp extends snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .SmartContract */ .C3 {
    constructor() {
        super(...arguments);
        this.nonogramHash = (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .State */ .ZM)();
    }
    init() {
        super.init();
        this.nonogramHash.set((0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(expectedHash));
    }
    /**
     * Note: We don't check if the user has already solved a specific puzzle
     *       It's up to the frontend to check if the puzzle is already solved by the user
     */
    submitSolution(solutionInstance, streaks) {
        const noColor = _common_types_js__WEBPACK_IMPORTED_MODULE_3__.Color.noColor();
        const solutionValue = solutionInstance.value;
        // get contract puzzle hash
        let nonogramHash = this.nonogramHash.get();
        this.nonogramHash.assertEquals(nonogramHash);
        // check streaks hash
        streaks
            .hash()
            .assertEquals(nonogramHash, 'streaks do not match the on-chain committed streaks for this nonogram');
        const emptyRow = new _common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__.RowClass([{ color: noColor, length: (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(1) }]);
        const emptyColumn = new _common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__.ColumnClass([{ color: noColor, length: (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN)(1) }]);
        // check row streaks
        for (let i = 0; i < _common_input_js__WEBPACK_IMPORTED_MODULE_1__/* .gameInfo.rows.length */ .d.rows.length; i++) {
            const adjustedStreaks = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](streaks.rows[i].length.equals(0), emptyRow, streaks.rows[i]);
            checkRowCircuit(solutionValue[i], noColor, adjustedStreaks);
        }
        // check column streaks
        {
            const column = Array.from({ length: _common_input_js__WEBPACK_IMPORTED_MODULE_1__/* .gameInfo.rows.length */ .d.rows.length }, (_) => new _common_types_js__WEBPACK_IMPORTED_MODULE_3__.Color(0));
            for (let i = 0; i < _common_input_js__WEBPACK_IMPORTED_MODULE_1__/* .gameInfo.columns.length */ .d.columns.length; i++) {
                for (let j = 0; j < _common_input_js__WEBPACK_IMPORTED_MODULE_1__/* .gameInfo.rows.length */ .d.rows.length; j++) {
                    column[j] = solutionValue[j][i];
                }
                const adjustedStreaks = snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Circuit["if"] */ .dx["if"](streaks.columns[i].length.equals(0), emptyColumn, streaks.columns[i]);
                checkRowCircuit(column, noColor, adjustedStreaks);
            }
        }
    }
}
__decorate([
    (0,snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .state */ .SB)(snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .Field */ .gN),
    __metadata("design:type", Object)
], NewNonogramZkApp.prototype, "nonogramHash", void 0);
__decorate([
    snarkyjs__WEBPACK_IMPORTED_MODULE_0__/* .method */ .UD,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__.NonogramSubmission,
        _common_ioTypes_js__WEBPACK_IMPORTED_MODULE_2__.SolutionNonogram]),
    __metadata("design:returntype", void 0)
], NewNonogramZkApp.prototype, "submitSolution", null);
//# sourceMappingURL=NewNonogramZkApp.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ 188:
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.a(__webpack_module__, async function (__webpack_handle_async_dependencies__, __webpack_async_result__) { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u": function() { return /* reexport safe */ _NewNonogramZkApp_js__WEBPACK_IMPORTED_MODULE_0__.u; }
/* harmony export */ });
/* harmony import */ var _NewNonogramZkApp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8864);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_NewNonogramZkApp_js__WEBPACK_IMPORTED_MODULE_0__]);
_NewNonogramZkApp_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


//# sourceMappingURL=index.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

}]);