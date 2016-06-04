var webpack = require('webpack');
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('Libs.js');/*可以用于分析模块的共用代码, 单独打一个包出来:*/
var distConfigs=require("./webpack.dist.config.js");


var developConfig= {
    devtool: 'source-map',/*生产环境，使用devtool:false这样打包出来的js会很小，开发环境，使用devtool: 'source-map'*/
    entry: [
        /*以下都会写进main.js*/
        'webpack/hot/dev-server',/*[HMR] Waiting for update signal from WDS..热加载必须要有的*/
        'webpack-dev-server/client?http://localhost:8080'/*[WDS]Hot Module Replacement enabled.热加载必须要有的*/
    ].concat(distConfigs.entry),
    plugins: [
        /*加上热替换的插件和防止报错的插件 以下都会写进main.js */
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ].concat(distConfigs.plugins),



    output:distConfigs.output,
    module:distConfigs.module,
    resolve:distConfigs.resolve,
    devServer:distConfigs.devServer,
    externals:distConfigs.externals
};
module.exports=developConfig;