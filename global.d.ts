export {}

declare global {
    interface Window {
        p5wasm: WebAssembly.Instance['exports'] | any
        wasmReady: Promise<any>
    }
}