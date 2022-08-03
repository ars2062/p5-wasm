
import p5 from './p5'
import p5Module from './p5.wasm'

const promise = p5({
    locateFile(path) {
        if (path.endsWith('.wasm')) {
            return p5Module;
        }
        return path;
    }
}).then(instance => {
    window.p5wasm = instance;

    // accessibility
    require('./accessibility/color_namer')

    // core
    require('./core/shape/2d_primitives');
    require('./core/shape/curves');
    require('./core/p5.Renderer2D');

    // math
    require('./math/calculation')
    require('./math/noise')
    require('./math/random')
    require('./math/trigonometry')
    require('./math/vector')
});
if (typeof window !== 'undefined')
    window.wasmReady = promise

export default promise