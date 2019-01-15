const plugin = require('../')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader'
                }
            ]
        }]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'all',
                    name: 'vendor_abc',
                    enforce: true
                },
            }
        },
        runtimeChunk: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new plugin()
    ]
}