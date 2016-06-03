
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");/*单独打包工具*/
var path = require('path');

module.exports = {
    devtool: false,/*生产环境，使用devtool:false这样打包出来的js会很小，开发环境，使用devtool: 'source-map'*/
    entry: [
        /*以下都会写进main.js*/
        //'webpack/hot/dev-server',/*[HMR] Waiting for update signal from WDS..热加载必须要有的*/
        //'webpack-dev-server/client?http://localhost:8080',/*[WDS]Hot Module Replacement enabled.热加载必须要有的*/
        './index.js' // 入口文件
    ],
    output: {
        path:path.join(__dirname, 'dist/'),
        filename: 'main.js',
        publicPath: ''/*发布路径一定要对，否则到时候在服务器上无法引用png,js等*/
    },
    module: {
        loaders: [
            {test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]'},/*让webpack帮助复制font文件*/
            {test:/\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader"),exclude: /node_modules/},
            {test: /\.(png|jpg|gif)$/, loader: 'url?limit=8192&name=./images/[name].[ext]?[hash:10]'}
        ]
    },
    resolve: {
        /*自动添加上后缀*/
        extensions: ['', '.js', '.jsx',"css","png","jpg","jpeg"]
    },
    plugins: [
        /*加上热替换的插件和防止报错的插件*/
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin("main.css")
    ],
    devServer: {
        historyApiFallback: true,
        devtool: eval,
        progress: true,
        colors: true,
        hot: true,
        profile: true
    },
    externals: [{
        //"$":"jQuery"
        /* 'react-dom': 'ReactDOM',
         'react': 'React'*/
    }]
};