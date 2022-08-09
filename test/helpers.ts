import { TSuit } from ".";
import fs from 'fs'

export function nameFromPath(p: string) {
    return p.replace(/\//g, '0').replace('.ts', '').replace('src/', '')
}



function parseValue(val, argType) {
    switch (argType) {
        case 'string':
            return val;
        case 'number':
            return Number(val)
        case 'boolean':
            return val === 'true';
    }
}



const functionRegex = /\/\**\n \* @benchmark\n \* @name \w+(\n \* @argument [{\w} \[=\]]+)*\n \*\//gm
const argumentsRegex = /@argument {(\w+)} \[(\w+)=(\w+)\]/g
const nameRegex = /@name ([\w\.]+)/
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

export function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};