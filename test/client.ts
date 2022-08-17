require('lodash')
require('benchmark')
import Benchmark from 'benchmark'
import p5 from 'p5';
import suites from './test.json'

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

const entries: Array<[string, TSuit]> = Object.entries(suites)
type ValueOf<T> = T[keyof T];
type TResult<T> = Record<string, { old?: T, wasm?: T }>
const res: TResult<Promise<Benchmark>> = {}

function test(namespace: keyof ValueOf<typeof res>) {
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
                    },
                    onError(e) {
                        console.error(e);
                        reject(e)
                    },

                }).run()
            })
        }
    }
}

test('old')

const resolved: TResult<Benchmark> = {}

Promise.all(Object.entries(res).map(i => i[1].old)).then((benchmarks) => {
    for (let i = 0; i < benchmarks.length; i++) {
        resolved[entries[i][0]] = { old: benchmarks[i] }
    }
    console.clear()
    console.log(resolved);
}).catch(e => {
    console.error(e);
})

