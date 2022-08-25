import p5 from "p5";

//@ts-ignore
window.oldFunc = p5.prototype._cacos;

const Module = window.p5wasm
/**
 * @benchmark
 * @name _rgbColorName
 * @argument {object} [start=[100,100,0,0]]
 */
// @ts-ignore
p5.prototype._rgbColorName = function (arg) {
    return Module._rgbColorName(arg[0], arg[1], arg[2], arg[3])
}