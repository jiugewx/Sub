/**
 * Created by Xinye on 2016/5/18.
 */
var webpack = require('webpack');
var path = require('path');

var ROOT_PATH = path.resolve(__dirname);
var DIST_PATH = path.resolve(ROOT_PATH, 'dist');

module.exports = {
    devtool: false,/*生产环境，使用devtool:false这样打包出来的js会很小，开发环境，使用devtool: 'source-map'*/
    entry: [
        /*以下都会写进main.js*/
        //'webpack/hot/dev-server',/*[HMR] Waiting for update signal from WDS..热加载必须要有的*/
        //'webpack-dev-server/client?http://localhost:3000',/*[WDS]Hot Module Replacement enabled.热加载必须要有的*/
        './index.js' // 入口文件
    ],
    output: {
        path:path.join(__dirname, 'dist/'),
        filename: 'main.js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {test: /\.css$/, loaders: ['style', 'css'],exclude: /node_modules/},
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
        ]
    },
    resolve: {
        /*自动添加上后缀*/
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        /*加上热替换的插件和防止报错的插件*/
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    devServer: {
        //contentBase: './dist',/*所有的文件都在这个下面包括html、jpg、js等*/
        historyApiFallback: true,
        devtool: eval,
        progress: true,
        colors: true,
        hot: true,
        profile: true
    },
    externals: [{
        /* 'react-dom': 'ReactDOM',
         'react': 'React'*/
    }]
};