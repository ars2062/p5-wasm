import p5 from "p5";

const Module = window.p5wasm

/**
 * @benchmark
 * @name abs
 * @argument {number} [n=100]
 */
p5.prototype.abs = Module._cabs
/**
 * @benchmark
 * @name ceil
 * @argument {number} [n=9.3]
 */
p5.prototype.ceil = Module._cceil
/**
 * @benchmark
 * @name exp
 * @argument {number} [n=2]
 */
p5.prototype.exp = Module._cexp
/**
 * @benchmark
 * @name floor
 * @argument {number} [n=9.3]
 */
p5.prototype.floor = Module._cfloor
/**
 * @benchmark
 * @name log
 * @argument {number} [n=100]
 */
p5.prototype.log = Module._clog
/**
 * @benchmark
 * @name pow
 * @argument {number} [n=2]
 * @argument {number} [e=10]
 */
p5.prototype.pow = Module._cpow

/**
 * @benchmark
 * @name constrain
 * @argument {number} [n=300]
 * @argument {number} [low=100]
 * @argument {number} [high=500]
 */
p5.prototype.constrain = function (n, low, high) {
    //@ts-ignore
    p5._validateParameters('constrain', arguments);
    return Module._constrain(n, low, high);
};
/**
 * @benchmark
 * @name dist
 * @argument {number} [x1=100]
 * @argument {number} [y1=100]
 * @argument {number} [x2=200]
 * @argument {number} [y2=500]
 */
p5.prototype.dist = function (...args) {
    //@ts-ignore
    p5._validateParameters('dist', args);
    const res = Module._dist(args[0], args[1], args[2], args[3], args[4], args[5])
    return res
};
p5.prototype.lerp = function (start, stop, amt) {
    //@ts-ignore
    p5._validateParameters('lerp', arguments);
    return Module._learp(start, stop, amt);
};
p5.prototype.mag = function (x, y) {
    //@ts-ignore
    p5._validateParameters('mag', arguments);
    return Module._mag(x, y);
};
p5.prototype.map = function (n, start1, stop1, start2, stop2, withinBounds) {
    //@ts-ignore
    p5._validateParameters('map', arguments);
    return Module._map(n, start1, stop1, start2, stop2, withinBounds)
};
p5.prototype.norm = function (n, start, stop) {
    //@ts-ignore
    p5._validateParameters('norm', arguments);
    return Module._norm(n, start, stop);
};
