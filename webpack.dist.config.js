var path = require('path');
var webpack = require('webpack');
/**
 extract-text-webpack-plugin插件，
 有了它就可以将你的样式提取到单独的css文件里，
 妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');


var distConfigs = {
    devtool:false,
    entry: { //配置入口文件，有几个写几个
        index: './src/index.js'
    },
    module: {
        loaders: [ //加载器，关于各个加载器的参数配置，可自行搜索之。
            {
                test: /\.css$/,
                //配置css的抽取器、加载器。'-loader'可以省去
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.less$/,
                //配置less的抽取器、加载器。中间!有必要解释一下，
                //根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
                //你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
                loader: ExtractTextPlugin.extract('css!less')
            }, {
                //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
                test: /\.html$/,
                loader: "html?attrs=img:src img:data-src"/*这样会压缩html中的图片*/
            }, {
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            }, {
                //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码，
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=20480&name=./images/[name].[ext]?[hash:8]'
                /*这里是默认的图片引用地址，并且也是相对于publish的存放地址。
                 在css中的效果就是  publish+url（因此要注意css的引用地址，及本身位置）*/
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: ['index', 'list', 'about'], //提取哪些模块共有的部分
            minChunks: 3 // 提取至少3个模块共有的部分
        }),
        new ExtractTextPlugin('./[name].css') //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
    ],
    output: {
        path: path.join(__dirname, 'dist'), //输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它
        publicPath: '',				//模板、样式、脚本、图片等资源对应的server上的路径,
        // 其中css中的背景图片的路径引用是相对于这个的。所有的url都会以这个为前缀
        filename: 'js/[name].js',			//每个页面对应的主js的生成配置
        chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
    },
    //使用webpack-dev-server，提高开发效率
    devServer: {
        historyApiFallback: true,
        contentBase: './dist/',/*所有的文件都要放在dist下面*/
        host: 'localhost',
        port: 8080,
        inline: true,
        devtool: eval,
        progress: true,
        colors: true,
        hot: true,
        profile: true
    },
    externals: [{
        /*不打包的库，html中使用CDN*/
        //jquery:"$"
        /* 'react-dom': 'ReactDOM',
         'react': 'React'*/
    }]
};

module.exports=distConfigs;