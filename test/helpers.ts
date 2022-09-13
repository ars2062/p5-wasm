import fs from 'fs'
import { createHash } from 'crypto'
export function nameFromPath(p: string) {
    return p.replace(/\//g, '-').replace('.ts', '').replace('src/', '')
}

function parseValue(val, argType) {
    switch (argType) {
        case 'string':
            return val;
        case 'number':
            return Number(val)
        case 'boolean':
            return val === 'true';
        case 'object':
            console.log(JSON.parse(val));

            return JSON.parse(val)
    }
}



const functionRegex = /\/\**\n \* @benchmark\n \* @name [\w\._]+(\n \* @argument [{\w} \[=\],":\.]+)*\n \*\//gm
const argumentsRegex = /@argument {(\w+)} \[(\w+)=([\[\]\w,":\.]+)\]/g
const nameRegex = /@name ([\w\._]+)/
export function getFunctionsFromPath(p: string): TSuit['functions'] {
    const txt = fs.readFileSync(p, {
        encoding: 'utf-8',
        flag: 'r'
    })
    const match = txt.matchAll(functionRegex)
    if (match) {
        const functionStrings = Array.from(match).map(i => i[0])
        return functionStrings.map(i => {
            const nameMatch = i.match(nameRegex)
            const argumentsMatch = Array.from(i.matchAll(argumentsRegex))
            return {
                name: nameMatch ? nameMatch[1] : '',
                hash: createHash('sha1').update(i).digest('hex'),
                arguments: argumentsMatch.map(j => ({
                    name: j[2],
                    type: j[1],
                    value: parseValue(j[3], j[1])
                }))
            }
        })
    }

    return [];
}

export function debounce(func: Function, wait, immediate) {
    var timeout;
    return function (...args) {
        var context = this;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    } as typeof func;
};
export type TSuit = {
    functions: {
        name: string,
        hash: string,
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