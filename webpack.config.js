var webpack = require('webpack');
var distConfigs = require("./webpack.dist.config.js");
/**
 html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
 具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');
/*设置环境变量--开发环境(这个定义位置只能放在这里)*/
process.env.NODE_ENV = 'development';
var development= definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'true'))
});

var defaultPre = {
    all_in_one: distConfigs.userOptions.all_in_one,
    chunks: distConfigs.userOptions.chunks,
    Plugins: [
        development,
        /*加上热替换的插件和防止报错的插件以下都会写进js */
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ].concat(distConfigs.userOptions.plugins),
    entry: distConfigs.entry,
    init: function () {
        var self = this;
        console.log("default-NODE_ENV", process.env.NODE_ENV);
        //self.setEntry();
        for (var i in self.chunks) {
            if (!self.all_in_one) {
                var htmlPlugins = new HtmlWebpackPlugin({
                    //favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
                    template: './src/' + self.chunks[i] + ".html", //html来源
                    filename: './' + self.chunks[i] + '.html', //生成的html存放路径，相对于path
                    chunks: [self.chunks[i], 'common'],//需要引入的chunk，不配置就会引入所有页面的资源
                    inject: 'body', //js插入的位置，true/'head'/'body'/false
                    hash: true, //为静态资源生成hash值
                    minify: { //压缩HTML文件
                        removeComments: false, //移除HTML中的注释
                        collapseWhitespace: false //删除空白符与换行符
                    }
                });
                self.Plugins.push(htmlPlugins);
            } else if (self.all_in_one) {
                var htmlPlugins = new HtmlWebpackPlugin({
                    //favicon: './src/img/favicon.ico',
                    template: './src/' + self.chunks[i] + ".html",
                    filename: './' + self.chunks[i] + '.html',
                    inject: 'body',
                    hash: true,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true
                    }
                });
                self.Plugins.push(htmlPlugins);
            }
        }
    }
};
defaultPre.init();
var defaultConfig = {};
if (process.env.NODE_ENV !== 'production') {
    console.log("the NODE_ENV is development");
    defaultConfig = {
        entry: defaultPre.entry,
        plugins: defaultPre.Plugins,
        devtool: "cheap-source-map",
        output: distConfigs.output,
        module: distConfigs.module,
        resolve: distConfigs.resolve,
        //使用webpack-dev-server，提高开发效率
        devServer: {
            historyApiFallback: true,
            contentBase: './dist/', /*所有的文件都要放在dist下面*/
            host: 'localhost',
            port: 8080,
            inline: true,
            devtool: eval,
            progress: true,
            colors: true,
            hot: true,
            profile: true
        },
        externals: distConfigs.externals
    }
}
if (process.env.NODE_ENV === 'production') {
    console.log("the NODE_ENV is production");
    defaultConfig = {
        entry: distConfigs.entry,
        plugins: distConfigs.plugins,
        devtool: distConfigs.devtool,
        output: distConfigs.output,
        module: distConfigs.module,
        resolve: distConfigs.resolve,
        externals: distConfigs.externals
    };
}

module.exports=defaultConfig;