
// @ts-ignore
const Module = window.p5wasm

export function createFloatArrayHEAP(length: number) {
    var data = new Float32Array(length);
    var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
    var dataPtr = Module._malloc(nDataBytes);
    var dataHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, nDataBytes);
    dataHeap.set(new Uint8Array(data.buffer));
    return { dataHeap, data, free: () => Module._free(dataHeap.byteOffset) }
}

export function getFloatArrayFromHEAP(dataHeap:Uint8Array,data:Float32Array){
    return  new Float32Array(dataHeap.buffer, dataHeap.byteOffset, data.length);
}