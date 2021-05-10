const path = require('path');
// const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
let entry;
let sourceMap = false;
let devtool = false;
let minimize = false;

if (process.env.MIN_POLIPOP === '0') {
    entry = {
        polipop: './src/index.js',
    };
} else if (process.env.MIN_POLIPOP === '1') {
    entry = {
        'polipop.min': './src/index.js',
    };
    sourceMap = false; // Set true to generate source maps for minified files.
    devtool = sourceMap ? 'source-map' : false;
    minimize = true;
}

module.exports = {
    mode: 'production',
    entry: entry,
    devtool: devtool,
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|docs)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    // plugins: [new CompressionPlugin()],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'Polipop',
            type: 'umd',
            export: 'default',
        },
        globalObject: 'this',
    },
    optimization: {
        minimize: minimize,
        minimizer: [new TerserPlugin()],
    },
};
