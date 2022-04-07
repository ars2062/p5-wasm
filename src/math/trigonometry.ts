import p5 from "p5";

const Module = window.p5wasm

p5.prototype.acos = Module._cacos
p5.prototype.asin = Module._casin
p5.prototype.atan = Module._catan
p5.prototype.atan2 = Module._catan2
p5.prototype.cos = Module._ccos
p5.prototype.sin = Module._csin
p5.prototype.tan = Module._ctan
p5.prototype.degrees = Module._degrees
p5.prototype.radians = Module._radians
p5.prototype.angleMode = Module._angleMode
// @ts-ignore
p5.prototype._toRadians = Module._toRadians
// @ts-ignore
p5.prototype._toDegrees = Module._toDegrees
// @ts-ignore
p5.prototype._fromRadians = Module._fromRadians