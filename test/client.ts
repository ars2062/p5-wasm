require('lodash')
import './index.scss'
import Benchmark from 'benchmark'
import { TSuit } from './helpers';
// @ts-ignore
window.Benchmark = Benchmark;
declare global {
    interface Window {
        p5: any
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

type ValueOf<T> = T[keyof T];
type TNamespace = keyof ValueOf<typeof res>
type TResult<T> = Record<string, { old?: T, wasm?: T }>
const res = createResultObject<Promise<Benchmark>>()

function test(namespace: TNamespace, entries: Array<[string, TSuit]>) {
    for (let i = 0; i < entries.length; i++) {
        const [name, suite] = entries[i];
        for (let j = 0; j < suite.functions.length; j++) {
            const func = suite.functions[j];
            const testName = `${name}-${func.name}`
            if (!res[testName]) res[testName] = {}
            res[testName][namespace] = new Promise<Benchmark>((resolve, reject) => {
                const benchmark = new Benchmark(function () {
                    window.p5.prototype[func.name](...func.arguments.map(k => k.value))
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
function resolveTest(namespace: TNamespace, entries) {
    test(namespace, entries)
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

function removeWasm() {
    document.querySelector('script[src="/p5.wasm.js"]')?.remove()
    delete require.cache['p5']
    window.p5 = require('p5/lib/p5')
    console.log(window.p5);
    
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
async function testSuits(suits: Record<string, TSuit>) {
    const entries = Object.entries(suits)
    await removeWasm()
    log('p5 resolving');
    await resolveTest('old', entries)
    log('p5 resolved');
    log('wasm loading');
    await loadWasm()
    log('wasm loaded');
    //@ts-ignore
    await window.wasmReady
    log('wasm ready');
    log('wasm resolving');
    await resolveTest('wasm', entries)
    log('wasm resolved');
}
const client = new WebSocket('ws://localhost:9001/', 'echo-protocol')

const testPromises: Array<Promise<void>> = []
const updates: Record<string, number> = {}
client.onmessage = async (ev) => {
    if (testPromises.length) await testPromises
    let suits = JSON.parse(ev.data) as Record<string, TSuit>
    suits = Object.fromEntries(Object.entries(suits).filter(([name, suit]) => {
        if (updates[name] !== suit.lastUpdate) {
            updates[name] = suit.lastUpdate
            return true
        }
        return false
    }))
    console.log(suits);


    testPromises.push(testSuits(suits));
}