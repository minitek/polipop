const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: {
        polipop: './src/index.js',
        'css/polipop.core': './src/sass.js/core.scss.js',
        'css/polipop.default': './src/sass.js/default.scss.js',
        'css/polipop.compact': './src/sass.js/compact.scss.js',
        'css/polipop.minimal': './src/sass.js/minimal.scss.js',
    },
    devtool: 'inline-source-map', // Enables us to see source files in browser dev tools.
    devServer: {
        contentBase: './docs',
        // webpack-dev-server does not store bundled files. After the dev build, it keeps them in memory
        // and serves them by default under http://[devServer.host]:[devServer.port]/[output.filename]
        //
        // Since the /docs/index.html page expects to find the bundled files
        // at http://[devServer.host]:[devServer.port]/dist/, we change the directory via the option
        // publicPath, so that the virtual files are now served under
        // http://[devServer.host]:[devServer.port]/[devServer.publicPath]/[output.filename]
        publicPath: '/dist/',
        // this solves an issue where the entry point path is incorrect when running dev-server
        // Remove if path is fixed in newer webpack versions:
        injectClient: false,
    },
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
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
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
        library: {
            name: 'Polipop',
            type: 'umd',
            export: 'default',
        },
        globalObject: 'this',
    },
    optimization: {
        minimize: false,
    },
};
