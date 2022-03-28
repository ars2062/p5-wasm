import p5, { Vector } from "p5";

const oldAdd = p5.Vector.prototype.add;

function add(x: number | Vector | number[], y?: number, z?: number): Vector {
  console.log("halloo", x);
  if (typeof x === "object") return oldAdd(x);
  else return oldAdd(x, y, z);
}

p5.Vector.prototype.add = add;
