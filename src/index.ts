
import p5 from './p5'
// @ts-ignore
import p5Module from './p5.wasm'

const promise = p5({
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
    require('./core/p5.Renderer2D.ts');
    // math
    require('./math/calculation.ts')
    require('./math/noise.ts')
});
if (typeof window !== 'undefined')
    // @ts-ignore
    window.wasmReady = promise

export default promise