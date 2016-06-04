var ExtractTextPlugin = require("extract-text-webpack-plugin");/*单独打包工具*/
var path = require('path');

var distConfigs={
    devtool:false,
    entry:[
        "./index.js"// 入口文件
    ],
    plugins:[new ExtractTextPlugin("main.css")],
    output: {
        path:path.join(__dirname, 'dist/'),
        filename: 'main.js',
        publicPath: ''/*发布路径一定要对，否则到时候在服务器上无法引用png,js等*/
    },
    module: {
        loaders: [
            {test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/, loader: 'url-loader?importLoaders=1&limit=1000&name=/fonts/[name].[ext]'},/*让webpack帮助复制font文件*/
            {test:/\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader"),exclude: /node_modules/},
            {test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url?limit=50000&name=./images/[name].[ext]?[hash:10]'}
        ]
    },
    resolve: {
        /*自动添加上后缀*/
        extensions: ['', '.js', '.jsx',"css","png","jpg","jpeg"]
    },
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
        jquery:"$"
        /* 'react-dom': 'ReactDOM',
         'react': 'React'*/
    }]
};

module.exports=distConfigs;