import p5 from "p5";
import { createFloatArrayHEAP, getFloatArrayFromHEAP } from "../../wasmUtils/array";

const Module = window.p5wasm

/**
 * @benchmark
 * @name _normalizeArcAngles
 * @argument {number} [start=100]
 * @argument {number} [stop=100]
 * @argument {number} [width=100]
 * @argument {number} [height=100]
 * @argument {boolean} [correctForScaling=true]
 */
// @ts-ignore
p5.prototype._normalizeArcAngles = (
    start,
    stop,
    width,
    height,
    correctForScaling
) => {
    const { dataHeap, data, free } = createFloatArrayHEAP(3)
    Module._normalizeArcAngles(start,
        stop,
        width,
        height,
        correctForScaling,
        dataHeap.byteOffset)
    const [resStart, resStop, correspondToSamePoint] = getFloatArrayFromHEAP(dataHeap, data);
    free()
    return {
        start: resStart,
        stop: resStop,
        correspondToSamePoint: Boolean(correspondToSamePoint)
    }
}