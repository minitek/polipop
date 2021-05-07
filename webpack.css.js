const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
let mode;
let entry;
let sourceMap = false;
let devtool = false;
let minimize = false;

if (process.env.MIN_POLIPOP === '0') {
    mode = 'development'; // MiniCssExtractPlugin embedded minimizer can't be disabled in 'production'.
    entry = {
        'css/polipop.core': './src/sass.js/core.scss.js',
        'css/polipop.default': './src/sass.js/default.scss.js',
        'css/polipop.compact': './src/sass.js/compact.scss.js',
        'css/polipop.minimal': './src/sass.js/minimal.scss.js',
    };
} else if (process.env.MIN_POLIPOP === '1') {
    mode = 'production';
    entry = {
        'css/polipop.core.min': './src/sass.js/core.scss.js',
        'css/polipop.default.min': './src/sass.js/default.scss.js',
        'css/polipop.compact.min': './src/sass.js/compact.scss.js',
        'css/polipop.minimal.min': './src/sass.js/minimal.scss.js',
    };
    sourceMap = false; // Set true to generate source maps for minified files.
    devtool = sourceMap ? 'source-map' : false;
    minimize = true;
}

module.exports = {
    mode: mode,
    entry: entry,
    devtool: devtool,
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: sourceMap } },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: sourceMap,
                            postcssOptions: {
                                plugins: [
                                    ['autoprefixer', {}],
                                    ['postcss-discard-comments', {}],
                                ],
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: sourceMap },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: minimize,
        minimizer: [new CssMinimizerPlugin()],
    },
};
