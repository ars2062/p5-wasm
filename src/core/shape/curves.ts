import p5 from "p5";

const Module = window.p5wasm


/**
 * @benchmark
 * @name bezierPoint
 * @argument {number} [a=100]
 * @argument {number} [b=100]
 * @argument {number} [c=100]
 * @argument {number} [d=100]
 * @argument {number} [t=100]
 */
p5.prototype.bezierPoint = function (a, b, c, d, t) {
    //@ts-ignore
    p5._validateParameters('bezierPoint', arguments);
    return Module._bezierPoint(a, b, c, d, t)
};

/**
 * @benchmark
 * @name bezierTangent
 * @argument {number} [a=100]
 * @argument {number} [b=100]
 * @argument {number} [c=100]
 * @argument {number} [d=100]
 * @argument {number} [t=100]
 */
p5.prototype.bezierTangent = function (a, b, c, d, t) {
    //@ts-ignore
    p5._validateParameters('bezierTangent', arguments);

    return Module._bezierTangent(a, b, c, d, t);
};

/**
 * @benchmark
 * @name curvePoint
 * @argument {number} [a=100]
 * @argument {number} [b=100]
 * @argument {number} [c=100]
 * @argument {number} [d=100]
 * @argument {number} [t=100]
 */
p5.prototype.curvePoint = function (a, b, c, d, t) {
    //@ts-ignore
    p5._validateParameters('curvePoint', arguments);

    return Module._curvePoint(a, b, c, d, t);
};

/**
 * @benchmark
 * @name curveTangent
 * @argument {number} [a=100]
 * @argument {number} [b=100]
 * @argument {number} [c=100]
 * @argument {number} [d=100]
 * @argument {number} [t=100]
 */
p5.prototype.curveTangent = function(a, b, c, d, t) {
    //@ts-ignore
    p5._validateParameters('curveTangent', arguments);
  
    return Module._curveTangent(a, b, c, d, t);
  };