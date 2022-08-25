require('lodash')
import './index.scss'
import p5 from 'p5'
import Benchmark from 'benchmark'
import suites from './test.json'
// @ts-ignore
window.Benchmark = Benchmark;
// @ts-ignore
window.p5 = p5
type TSuit = {
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

const main = document.querySelector('main')

function onFunctionAdd(name) {
    if (document.getElementById(name)) return;
    main?.insertAdjacentHTML('beforeend', `
        <div class="suit" id="${name}">
            <h2>${name}</h2>
            <div class="suit__progress">
                <div class="suit__progress__old"></div>
                <div class="suit__progress__wasm"></div>
            </div>
        </div>
    `)
}

function calcOverallResult() {
    const old = document.querySelector(`#result .progress .old`) as HTMLElement
    const wasm = document.querySelector(`#result .progress .wasm`) as HTMLElement


    const oldValue = [...document.querySelectorAll<HTMLElement>(`.suit__progress__old`)].reduce((sum, i) => sum + Number(i.dataset.value || 0), 0)
    const wasmValue = [...document.querySelectorAll<HTMLElement>(`.suit__progress__wasm`)].reduce((sum, i) => sum + Number(i.dataset.value || 0), 0)
    
    const sum = oldValue + wasmValue
    const oldProgress = oldValue / sum * 100
    const wasmProgress = wasmValue / sum * 100

    old.style.flexBasis = `${oldProgress}%`
    old.innerHTML = `${oldProgress.toFixed(2)}%`
    wasm.style.flexBasis = `${wasmProgress}%`
    wasm.innerHTML = `${wasmProgress.toFixed(2)}%`
}

function onSuitCycle(name, namespace: TNamespace, bench: Benchmark) {
    const progresses = {
        old: document.querySelector(`#${name} .suit__progress .suit__progress__old`) as HTMLElement,
        wasm: document.querySelector(`#${name} .suit__progress .suit__progress__wasm`) as HTMLElement
    }
    const value = bench.stats.mean + bench.stats.moe;
    progresses[namespace].dataset.value = value.toString()

    const oldValue = Number(progresses.old.dataset.value || 0)
    const wasmValue = Number(progresses.wasm.dataset.value || 0)

    const sum = oldValue + wasmValue
    const oldProgress = oldValue / sum * 100
    const wasmProgress = wasmValue / sum * 100

    progresses.old.style.flexBasis = `${oldProgress}%`
    progresses.old.innerHTML = `${oldProgress.toFixed(2)}%`
    progresses.wasm.style.flexBasis = `${wasmProgress}%`
    progresses.wasm.innerHTML = `${wasmProgress.toFixed(2)}%`
    calcOverallResult()
}

function createResultObject<T>(): TResult<T> {
    const Object = new Proxy({}, {
        set(target, p, value) {
            onFunctionAdd(p)
            target[p] = value
            return true
        },
    })
    return Object
}

const entries: Array<[string, TSuit]> = Object.entries(suites)
type ValueOf<T> = T[keyof T];
type TNamespace = keyof ValueOf<typeof res>
type TResult<T> = Record<string, { old?: T, wasm?: T }>
const res = createResultObject<Promise<Benchmark>>()

function test(namespace: TNamespace) {
    for (let i = 0; i < entries.length; i++) {
        const [name, suite] = entries[i];
        for (let j = 0; j < suite.functions.length; j++) {
            const func = suite.functions[j];
            const testName = `${name}-${func.name}`
            if (!res[testName]) res[testName] = {}
            res[testName][namespace] = new Promise<Benchmark>((resolve, reject) => {
                const benchmark = new Benchmark(function () {
                    p5.prototype[func.name](...func.arguments.map(k => k.value))
                }, {
                    async: true,
                    name: testName,
                    onComplete() {
                        resolve(benchmark)
                        onSuitCycle(testName, namespace, benchmark)
                    },
                    onError(e) {
                        reject(e)
                    },
                    onCycle({ target }) {
                        onSuitCycle(testName, namespace, target)
                    }

                }).run()
            })
        }
    }
}

const resolved = createResultObject<Benchmark>()
function resolveTest(namespace: TNamespace) {
    test(namespace)
    return Promise.all(Object.entries(res)
        .map(i => i[1][namespace]))
        .then((benchmarks) => {
            const resEntries = Object.entries(res)
            for (let i = 0; i < benchmarks.length; i++) {
                if (!resolved[resEntries[i][0]]) resolved[resEntries[i][0]] = {}
                resolved[resEntries[i][0]][namespace] = benchmarks[i]
            }
        }).catch(e => {
            console.error(e);
        })
}

function loadWasm() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = '/p5.wasm.js'
        script.onload = resolve;
        script.onerror = reject;
        document.body.append(script)
    })
}

function log(text) {
    const log = document.querySelector('#log')
    if (!log) return
    log.insertAdjacentHTML('beforeend', `
        <p> #> ${text}</p>
    `)
    log.scrollTop = log.scrollHeight - log.clientHeight
}
(async function () {
    log('p5 resolving');
    await resolveTest('old')
    log('p5 resolved');
    log('wasm loading');
    await loadWasm()
    log('wasm loaded');
    //@ts-ignore
    await window.wasmReady
    log('wasm ready');
    log('wasm resolving');
    await resolveTest('wasm')
    log('wasm resolved');
})()
