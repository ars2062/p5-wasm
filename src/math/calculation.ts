import p5 from "p5";
import { createFloatArrayHEAP, transferToHeap } from "../wasmUtils/array";

//@ts-ignore
window.oldFunc = p5.prototype.dist;

// @ts-ignore
const Module = window.p5wasm

p5.prototype.abs = Module._cabs
p5.prototype.ceil = Module._ccseil
p5.prototype.exp = Module._cexp
p5.prototype.constrain = function (n, low, high) {
    //@ts-ignore
    p5._validateParameters('constrain', arguments);
    return Module._constrain(n, low, high);
};
p5.prototype.dist = function (...args) {
    //@ts-ignore
    p5._validateParameters('dist', args);
    const arrayOnHeap = transferToHeap(args)
    const res = Module._dist(arrayOnHeap, args.length)
    return res
};