interface Window {
    p5wasm: WebAssembly.Instance['exports'] | any
    wasmReady: Promise<any>
}

declare module '*.wasm'{
    const path: string;
    export default path
}