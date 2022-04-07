import p5 from "p5";

const Module = window.p5wasm

// @ts-ignore
p5.prototype._lcg = Module._lcg
// @ts-ignore
p5.prototype._lcgSetSeed = Module._lcgSetSeed
p5.prototype.randomSeed = Module._randomSeed
p5.prototype.random = function (min?: any, max?) {
    if (typeof min !== 'undefined' && typeof max === 'undefined' && min instanceof Array) {
        let rand = Module._getRand()
        return min[Math.floor(rand * min.length)] as number;
    }
    return Module._crandom(min, max) as number;
}
p5.prototype.randomGaussian = Module._randomGaussian