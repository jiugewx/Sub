/**
 * Created by Wangxin on 2016/5/6.
 */

var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: false,/*生产环境，使用devtool:false这样打包出来的js会很小，开发环境，使用devtool: 'source-map'*/
    entry: [
        //'webpack-dev-server/client?http://127.0.0.1:3000', /*这里的client?http://127.0.0.1:3000需要和在server.js中启动Webpack开发服务器的地址匹配。*/
        //'webpack/hot/only-dev-server',
        './js/entry.js' // 入口文件
    ],
    output: {
        path:path.join(__dirname, 'dist/scripts/'),
        filename: 'main.js',
        publicPath: '/dist/scripts/'
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style!css', include:/demo/,exclude: /node_modules/}, /*这里是style-loader!css-loader的简写*/
            {test: /\.jsx?$/, loader: 'jsx-loader?harmony', include:/demo/,exclude: /node_modules/}
            //{test: /\.jsx?$/, loader: 'react-hot!jsx-loader?harmony', include:/demo/,exclude: /node_modules/}
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
    externals: {
        /*不打包的js库,格式：后续引用中的 名称："真实名称"，也是后续依赖使用中的名称，如：var $=require('jquery');*/
        react: "React",
        zepto: "zepto"
    }
};