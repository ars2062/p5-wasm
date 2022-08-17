import chokidar, { FSWatcher } from 'chokidar'
import fs from 'fs'
import { debounce, getFunctionsFromPath, nameFromPath, TSuit } from './helpers';
import { Configuration, webpack, ContextReplacementPlugin } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import path from 'path';
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig: Configuration = {
    entry: path.resolve(__dirname, 'client.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'test.[contenthash:4].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            template: path.resolve(__dirname, 'index.html'),
            filename: path.resolve(__dirname, 'dist/index.html')
        }),
    ],
    resolve: {
        extensions: ['.json', '.ts', '.js']
    },
    devServer: {
        port: process.env.PORT,
        host: process.env.HOST,
        hot: true,
        open: true
    },
    module: {
        exprContextCritical: false,
        noParse: [
            /benchmark/,
        ],
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
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