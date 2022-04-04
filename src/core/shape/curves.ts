import p5 from "p5";

// @ts-ignore
const Module = window.p5wasm

p5.prototype.bezierPoint = function (a, b, c, d, t) {
    //@ts-ignore
    p5._validateParameters('bezierPoint', arguments);
    return Module._bezierPoint(a, b, c, d, t)
};

p5.prototype.bezierTangent = function (a, b, c, d, t) {
    //@ts-ignore
    p5._validateParameters('bezierTangent', arguments);

    return Module._bezierTangent(a, b, c, d, t);
};

p5.prototype.curvePoint = function (a, b, c, d, t) {
    //@ts-ignore
    p5._validateParameters('curvePoint', arguments);

    return Module._curvePoint(a, b, c, d, t);
};

p5.prototype.curveTangent = function(a, b, c, d, t) {
    //@ts-ignore
    p5._validateParameters('curveTangent', arguments);
  
    return Module._curveTangent(a, b, c, d, t);
  };