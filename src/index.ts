
import p5 from './p5'
// @ts-ignore
import p5Module from './p5.wasm'

// @ts-ignore
window.wasmReady = p5({
    locateFile(path) {
        if (path.endsWith('.wasm')) {
            return p5Module;
        }
        return path;
    }
}).then(instance => {
    // @ts-ignore
    window.p5wasm = instance;

    // core
    require('./core/shape/2d_primitives.ts');
    require('./core/shape/curves.ts');
});