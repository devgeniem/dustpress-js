const webpack = require( 'webpack' );

// Provide jQuery instance for all modules.
const providePlugin = new webpack.ProvidePlugin({
    jQuery: 'jquery',
    '$': 'jquery'
});

/**
 * Webpack options
 * @type {Object}
 *       entry: a file specifying what files to require
 *       output: a folder that speicifes where all compiled output goes and a file where compiled javascript goes
 *       module.rules: loaders to be used for compiling the files, current compilers handle scss and markdown
 */
module.exports = {
    devtool: 'source-map',
    entry: {
        dustpress: __dirname + '/js/dustpress.js'
    },
    output: {
        path: __dirname + '/js/',
        filename: '[name]-min.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: [ '@babel/preset-env' ]
                    }
                }
            }
        ]
    },
    plugins: [
        providePlugin
    ],
    externals: {
        'jquery': 'jQuery'
    },
    watchOptions: {
        poll: 100
    }
};
