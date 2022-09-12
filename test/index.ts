import chokidar, { FSWatcher } from 'chokidar'
import fs from 'fs'
import { debounce, getFunctionsFromPath, nameFromPath, TSuit } from './helpers';
import { Configuration, webpack, ContextReplacementPlugin } from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import http from 'http'
import { connection, server as WebsocketServer } from 'websocket';
const httpServer = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
httpServer.listen(9001, function () {
    console.log((new Date()) + ' Server is listening on port 9001');
});

const wsServer = new WebsocketServer({
    httpServer,
    autoAcceptConnections: false
});
const connections: connection[] = []
wsServer.on('request', function (request) {
    const connection = request.accept('echo-protocol', request.origin);
    connections.push(connection)
    console.log((new Date()) + ' Connection accepted.');
    sendSuits(testSuits)
    connection.on('close', function (reasonCode, description) {
        connections.splice(connections.findIndex(i => i === connection), 1)
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
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
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../dist"),
                    to: path.resolve(__dirname, "dist")
                }
            ]
        })
    ],
    resolve: {
        extensions: ['.json', '.ts', '.js']
    },
    devServer: {
        port: process.env.PORT,
        host: process.env.HOST,
        hot: true,
        open: true,
        static: {
            directory: path.resolve(__dirname, 'dist')
        }
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
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            }
        ],
    },
    experiments: {
        asyncWebAssembly: true
    },
    mode: 'development'
}

const compiler = webpack(webpackConfig)
compiler.watch({
    aggregateTimeout: 300,
    poll: true,
    ignored: /node_modules/
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


const sendSuits = debounce(function (suits: Record<string, TSuit>) {
    connections.forEach((connection) => {
        connection.sendUTF(JSON.stringify(suits))
    })
}, 300, false)

function handlerFileChange(path, state: 'ADD' | 'CHANGE' | 'UNLINK') {
    if (path === 'test/index.ts' && state === 'CHANGE') {
        testSuits = {}
        startWatching()
    } else if (state === 'UNLINK') {
        delete testSuits[nameFromPath(path)]
    } else {
        testSuits[nameFromPath(path)] = {
            functions: getFunctionsFromPath(path),
            lastUpdate: Number(new Date())
        }
    }
    sendSuits(testSuits)
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