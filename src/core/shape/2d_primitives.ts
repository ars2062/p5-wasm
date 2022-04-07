import p5 from "p5";
import { createFloatArrayHEAP, getFloatArrayFromHEAP } from "../../wasmUtils/array";

const Module = window.p5wasm

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