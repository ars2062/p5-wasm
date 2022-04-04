import p5 from "p5";
import { createFloatArrayHEAP, getFloatArrayFromHEAP } from "../wasmUtils/array";

// @ts-ignore
const Module = window.p5wasm

//@ts-ignore
p5.Renderer2D.prototype._acuteArcToBezier = function (
    start,
    size
) {
    const { dataHeap, data, free } = createFloatArrayHEAP(8)
    Module._acuteArcToBezier(start, size, dataHeap.byteOffset)

    const [ax,
        ay,
        bx,
        by,
        cx,
        cy,
        dx,
        dy] = getFloatArrayFromHEAP(dataHeap, data)

    free()
    return {
        ax,
        ay,
        bx,
        by,
        cx,
        cy,
        dx,
        dy
    };
};