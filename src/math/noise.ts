import p5 from "p5";

//@ts-ignore
window.oldFunc = p5.prototype.noise;

// @ts-ignore
const Module = window.p5wasm

p5.prototype.noise = function (x, y = 0, z = 0) {
    return Module._noise(x, y, z)
};
p5.prototype.noiseDetail = Module._noiseDetail;
p5.prototype.noiseSeed = Module._noiseSeed;