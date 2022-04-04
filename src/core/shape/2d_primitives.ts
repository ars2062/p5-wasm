import p5 from "p5";

// @ts-ignore
const Module = window.p5wasm

// @ts-ignore
p5.prototype._normalizeArcAngles = (
    start,
    stop,
    width,
    height,
    correctForScaling
) => {
    var data = new Float32Array(3);
    var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
    var dataPtr = Module._malloc(nDataBytes);
    var dataHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, nDataBytes);
    dataHeap.set(new Uint8Array(data.buffer));
    Module._normalizeArcAngles(start,
        stop,
        width,
        height,
        correctForScaling,
        dataHeap.byteOffset)
    const [resStart, resStop, correspondToSamePoint] = new Float32Array(dataHeap.buffer, dataHeap.byteOffset, data.length);
    Module._free(dataHeap.byteOffset);
    return {
        start: resStart,
        stop: resStop,
        correspondToSamePoint: Boolean(correspondToSamePoint)
    }
}