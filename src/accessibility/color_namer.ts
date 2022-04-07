import p5 from "p5";

//@ts-ignore
window.oldFunc = p5.prototype._cacos;

// @ts-ignore
const Module = window.p5wasm

// @ts-ignore
p5.prototype._rgbColorName = function (arg) {
    return Module._rgbColorName(arg[0], arg[1], arg[2], arg[3])
}