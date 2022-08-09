import benchmark, { Suite } from 'benchmark';
import chokidar, { FSWatcher } from 'chokidar'
import fs from 'fs'
import { debounce, getFunctionsFromPath, nameFromPath } from './helpers';

export type TSuit = {
    functions: {
        name: string,
        arguments: {
            name: string,
            type: string,
            value: any
        }[]
    }[],
    result?: {
        name: string,
        oldFunction: string,
        newFunction: string
    }
}

let testSuits: Record<string, TSuit> = {}

const test = debounce(function() {
    // console.log(testSuits);
    let i = 0
    fs.writeFileSync('./test/sketch.js', `
        const oldP5 = Object.assign(function(){},p5)
        const main = document.querySelector('main');
        function log(txt){
            main.append(txt, document.createElement('br'))
        }
        window.wasmReady.then(() => {
        ${Object.entries(testSuits).map(([fileName, suit]) => 
        suit.functions.map((func) => `
                const suite${++i} = new Benchmark.Suite;
                suite${i}.add('P5 => ${fileName} => ${func.name}', function() {
                    oldP5.prototype.${func.name}(${func.arguments.map(arg => JSON.stringify(arg.value)).join(', ')})
                }).add('P5Wasm => ${fileName} => ${func.name}', function() {
                    p5.prototype.${func.name}(${func.arguments.map(arg => JSON.stringify(arg.value)).join(', ')})
                }).on('complete', function() {
                    console.log(this)
                    log('Fastest is ' + this.filter('fastest').map('name'));
                }).run({ 'async': true });
            `).join('\n')
    ).join('\n')
        }
        });
    `)
}, 300, false)

function handlerFileChange(path, state: 'ADD' | 'CHANGE' | 'UNLINK') {
    if (path === 'test/index.ts' && state === 'CHANGE') {
        testSuits = {}
        startWatching()
    } else if (state === 'UNLINK') {
        delete testSuits[nameFromPath(path)]
    } else {
        testSuits[nameFromPath(path)] = {
            functions: getFunctionsFromPath(path)
        }
    }
    test()
}

let watcher: FSWatcher
async function startWatching() {
    if (watcher) {
        console.clear()
        await watcher.close()
    }
    watcher = chokidar.watch('./**/*.ts', {
        ignored: (path) => path.includes('node_modules')
    })
    const log = console.log.bind(console);

    watcher
        .on('add', path => {
            log(`File ${path} has been added`)
            handlerFileChange(path, 'ADD')
        })
        .on('change', path => {
            log(`File ${path} has been changed`)
            handlerFileChange(path, 'CHANGE')
        })
        .on('unlink', path => {
            log(`File ${path} has been removed`)
            handlerFileChange(path, 'UNLINK')
        });
}

startWatching()