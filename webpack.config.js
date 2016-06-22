var webpack = require('webpack');
var distConfigs = require("./configs/webpack.dist.config.js");
/**
 html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
 具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');
/*设置环境变量--开发环境(这个定义位置只能放在这里)*/
process.env.NODE_ENV = 'development';
var development= definePlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': "'development'"
});

var defaultPre;
defaultPre = {
    htmlSrc: distConfigs.BaseConfigOptions.htmlSrc,
    htmlPub: distConfigs.BaseConfigOptions.htmlPub,
    all_in_one: distConfigs.BaseConfigOptions.all_in_one,
    chunks: distConfigs.BaseConfigOptions.chunks,
    plugins: [
        development,
        /*加上热替换的插件和防止报错的插件以下都会写进js */
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ].concat(distConfigs.BaseConfigOptions.plugins),
    init: function () {
        var self = this;
        for (var i in self.chunks) {
            if (!self.all_in_one) {
                var htmlPlugins = new HtmlWebpackPlugin({
                    //favicon: './src/img/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
                    template: self.htmlSrc + self.chunks[i] + ".html", //html来源
                    filename: self.htmlPub + self.chunks[i] + '.html', //生成的html存放路径，相对于path
                    chunks: [self.chunks[i], 'common'],//需要引入的chunk，不配置就会引入所有页面的资源
                    inject: 'body', //js插入的位置，true/'head'/'body'/false
                    hash: true, //为静态资源生成hash值
                    minify: { //压缩HTML文件
                        removeComments: false, //移除HTML中的注释
                        collapseWhitespace: false //删除空白符与换行符
                    }
                });
                self.plugins.push(htmlPlugins);
            } else if (self.all_in_one) {
                var htmlPlugins = new HtmlWebpackPlugin({
                    //favicon: './src/img/favicon.ico',
                    template: self.htmlSrc + self.chunks[i] + ".html",
                    filename: self.htmlPub + self.chunks[i] + '.html',
                    inject: 'body',
                    hash: true,
                    minify: {
                        removeComments: false,
                        collapseWhitespace: false
                    }
                });
                self.plugins.push(htmlPlugins);
            }
        }
    }
};
defaultPre.init();
var defaultConfig = {};
if (process.env.NODE_ENV !== 'production') {
    console.log("Current NODE_ENV is development");
    defaultConfig = {
        entry: distConfigs.entry,
        plugins: defaultPre.plugins,
        devtool: "cheap-source-map",
        output: distConfigs.output,
        module: distConfigs.module,
        resolve: distConfigs.resolve,
        vue:[],
        babel: distConfigs.babel,
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
module.exports=defaultConfig;