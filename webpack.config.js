const webpack = require('webpack');
require('dotenv').config();
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';

const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


//functions control webpack parameters

const optimization = () => {
    const config = {
        splitChunks: {
            name: 'all'
        }
    };
    if (!isDev) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin(),
            new UglifyJsPlugin({
                test: /\.js(\?.*)?$/i,
                parallel: true,
                cache: true,
                extractComments: 'all',
            })
        ]
    }
    return config;
};
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;
const loader = (add = 'css') => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true,
            },
        }
    ];
    switch (true) {
        case add !== 'css':
            loaders.push(...['css-loader', add += '-loader']);
            break;
        default:
            loaders.push(add += '-loader');
            break;
    }
    return loaders;
};
const babelLoader = (add = 'js') => {

    let preset = [];

    let use = [
        {
            loader: 'babel-loader',
            options: {
                presets: preset
            }
        }
    ];

    switch (add) {
        case 'js':
            isDev ? use.unshift({loader: 'eslint-loader'}) : '';
            preset.push('@babel/preset-env');
            break;
        case 'ts':
            preset.push('@babel/preset-typescript');
            break;
        case 'jsx':
            preset.push('@babel/preset-react');
            break;
        default:
            preset.push('@babel/preset-env');
            break;
    }

    return use
};
const basePlugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: !isDev
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, './src/assets/images/'),
                to: path.resolve(__dirname, 'dist/images/')
            },
            {
                from: path.resolve(__dirname, './src/assets/json/'),
                to: path.resolve(__dirname, 'dist/json/')
            }
        ]),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
    ];


    return base;
};

const config = {
    context: path.resolve(__dirname, './src'),
    mode: 'development',
    devtool: isDev ? 'source-map' : '',
    entry: {
        main: ['@babel/polyfill', './index.js'],
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, './dist')
    },
    optimization: optimization(),
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.json', '.png', '.svg', '.jpeg', '.jpg', '.xml'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@models': path.resolve(__dirname, 'src/models'),
        }
    },
    plugins: basePlugins(),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [
                    /node_modules/
                ],
                use: babelLoader('js')
            },
            {
                test: /\.ts$/,
                exclude: [
                    /node_modules/
                ],
                use: babelLoader('ts')
            },
            {
                test: /\.jsx$/,
                exclude: [
                    /node_modules/
                ],
                use: babelLoader('jsx')
            },
            {
                test: /\.css$/i,
                use: loader('css'),
            },
            {
                test: /\.less$/i,
                use: loader('less'),
            },
            {
                test: /\.(s[ac])ss$/i,
                use: loader('sass'),
            },
            // {
            //     test: /\.(png|jpe?g|gif|svg)$/i,
            //     loader: 'file-loader',
            //     options: {
            //         name: '[hash].[ext]',
            //         outputPath: 'images',
            //     }
            // },
            {
                test: /\.(ttf|woff|woff2|eot)$/i,
                loader: ['file-loader'],
            },
            {
                test: /\.xml$/i,
                loader: ['xml-loader'],
            },
            {
                test: /\.csv$/i,
                loader: 'csv-loader'
            }
        ]
    },
    devServer: {
        port: 8080,
        hot: isDev
    }
};

module.exports = config;
