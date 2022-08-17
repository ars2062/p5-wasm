import chokidar, { FSWatcher } from 'chokidar'
import fs from 'fs'
import { debounce, getFunctionsFromPath, nameFromPath } from './helpers';
import { Configuration, webpack, ContextReplacementPlugin } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
const HtmlWebpackPlugin = require('html-webpack-plugin');
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

const webpackConfig: Configuration = {
    entry: path.resolve(__dirname, 'client.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'test.[contenthash:4].js',
        // clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            // inject: false,
            template: path.resolve(__dirname, 'index.html'),
            filename: path.resolve(__dirname, 'dist/index.html')
        }),
        // new ContextReplacementPlugin(/\/benchmark\//, (data) => {
        //     delete data.dependencies[0].critical;
        //     return data;
        // })
    ],
    resolve: {
        extensions: ['.json', '.ts', '.js']
    },
    devServer: {
        port: process.env.PORT || 8000,
        host: process.env.HOST || '0.0.0.0',
        hot: true
    },
    module: {
        exprContextCritical: false,
    },
    mode: 'development'
}

const compiler = webpack(webpackConfig)
compiler.watch({
    aggregateTimeout: 300,
    poll: undefined
}, (err, stats) => { });

const server = new WebpackDevServer(webpackConfig.devServer, compiler);
server.start()
if (!compiler.running)
    compiler.run((err, res) => {
        if (err) console.error(err)
        else {
            console.log(path.resolve(__dirname, 'index.html'));
            console.log('client test updated');

        }
    })

let testSuits: Record<string, TSuit> = {}

const writeSuits = debounce(function () {
    fs.writeFileSync('./test/test.json', JSON.stringify(testSuits))
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
    writeSuits()
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