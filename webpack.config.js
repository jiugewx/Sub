var webpack = require('webpack');
var distConfigs=require("./webpack.dist.config.js");
/**
 html-webpack-plugin插件，重中之重，webpack中生成HTML的插件，
 具体可以去这里查看https://www.npmjs.com/package/html-webpack-plugin
 */
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports= {
    entry:distConfigs.entry,
    plugins: [
        //HtmlWebpackPlugin，模板生成相关的配置，每个对于一个页面的配置，有几个写几个
        new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
            favicon: './src/img/subway/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
            template: './index.html', //html来源
            filename: './index.html', //生成的html存放路径，相对于path
            chunks: ['common', 'index'],//需要引入的chunk，不配置就会引入所有页面的资源
            inject: 'body', //js插入的位置，true/'head'/'body'/false
            hash: true, //为静态资源生成hash值
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: true //删除空白符与换行符
            }
        }),

        /*加上热替换的插件和防止报错的插件以下都会写进js */
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()

    ].concat(distConfigs.plugins),
    devtool:false,
    output:distConfigs.output,
    module:distConfigs.module,
    resolve:distConfigs.resolve,
    devServer:distConfigs.devServer,
    externals:distConfigs.externals
};
