
        const main = document.querySelector('main');
        function log(txt){
            main.append(txt, document.createElement('br'))
        }
        const oldP5 = Object.assign(function(){},p5)
        window.wasmReady.then(() => {
        











                const suite1 = new Benchmark.Suite;
                suite1.add('P5 => src0core0shape02d_primitives => _normalizeArcAngles', function() {
                    oldP5.prototype._normalizeArcAngles(100, 100, 100, 100, true)
                }).add('P5Wasm => src0core0shape02d_primitives => _normalizeArcAngles', function() {
                    p5.prototype._normalizeArcAngles(100, 100, 100, 100, true)
                }).on('complete', function() {
                    console.log(this)
                    log('Fastest is ' + this.filter('fastest').map('name'));
                }).run({ 'async': true });
            

                const suite2 = new Benchmark.Suite;
                suite2.add('P5 => src0core0shape0curves => bezierPoint', function() {
                    oldP5.prototype.bezierPoint(100, 100, 100, 100, 100)
                }).add('P5Wasm => src0core0shape0curves => bezierPoint', function() {
                    p5.prototype.bezierPoint(100, 100, 100, 100, 100)
                }).on('complete', function() {
                    console.log(this)
                    log('Fastest is ' + this.filter('fastest').map('name'));
                }).run({ 'async': true });
            

                const suite3 = new Benchmark.Suite;
                suite3.add('P5 => src0core0shape0curves => bezierTangent', function() {
                    oldP5.prototype.bezierTangent(100, 100, 100, 100, 100)
                }).add('P5Wasm => src0core0shape0curves => bezierTangent', function() {
                    p5.prototype.bezierTangent(100, 100, 100, 100, 100)
                }).on('complete', function() {
                    console.log(this)
                    log('Fastest is ' + this.filter('fastest').map('name'));
                }).run({ 'async': true });
            

                const suite4 = new Benchmark.Suite;
                suite4.add('P5 => src0core0shape0curves => curvePoint', function() {
                    oldP5.prototype.curvePoint(100, 100, 100, 100, 100)
                }).add('P5Wasm => src0core0shape0curves => curvePoint', function() {
                    p5.prototype.curvePoint(100, 100, 100, 100, 100)
                }).on('complete', function() {
                    console.log(this)
                    log('Fastest is ' + this.filter('fastest').map('name'));
                }).run({ 'async': true });
            

                const suite5 = new Benchmark.Suite;
                suite5.add('P5 => src0core0shape0curves => curveTangent', function() {
                    oldP5.prototype.curveTangent(100, 100, 100, 100, 100)
                }).add('P5Wasm => src0core0shape0curves => curveTangent', function() {
                    p5.prototype.curveTangent(100, 100, 100, 100, 100)
                }).on('complete', function() {
                    console.log(this)
                    log('Fastest is ' + this.filter('fastest').map('name'));
                }).run({ 'async': true });
            
        });
    