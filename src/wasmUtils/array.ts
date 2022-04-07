
const Module = window.p5wasm

export function createFloatArrayHEAP(length: number) {
    var data = new Float32Array(length);
    var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
    var dataPtr = Module._malloc(nDataBytes);
    var dataHeap = new Uint8Array(Module.HEAPU8.buffer, dataPtr, nDataBytes);
    dataHeap.set(new Uint8Array(data.buffer));
    return { dataHeap, data, free: () => Module._free(dataHeap.byteOffset) }
}

export function getFloatArrayFromHEAP(dataHeap: Uint8Array, data: Float32Array) {
    return new Float32Array(dataHeap.buffer, dataHeap.byteOffset, data.length);
}

export function transferToHeap(arr) {
    const floatArray = toFloatArr(arr);
    const heapSpace = Module._malloc(floatArray.length *
        floatArray.BYTES_PER_ELEMENT); 
    Module.HEAPF32.set(floatArray, heapSpace >> 2);     
    return heapSpace;
}
export function toFloatArr(arr) {
    const res = new Float32Array(arr.length);
    for (let i = 0; i < arr.length; i++)
        res[i] = arr[i];
    return res;

}