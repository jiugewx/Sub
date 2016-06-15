var path = require('path');
var webpack = require('webpack');
/**
 extract-text-webpack-plugin插件，
 有了它就可以将你的样式提取到单独的css文件里，
 妈妈再也不用担心样式会被打包到js文件里了。
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');
/*设置环境变量--生产环境(这个定义位置只能放在这里)*/
process.env.NODE_ENV = 'production';
var production = new webpack.DefinePlugin({
    __DEV__:JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'false')),
    "process.env":{
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')}
});

var preConfig={
    all_in_one: true,/*是否只输出一个js/css,还是要输出一个html对应多个js/css*/
    one_js: {entry: "./src/index.js"},
    all_js: {
        /*配置入口文件，有几个写几个*/
        index: './src/index.js'
    },
    entry:{},
    output:{},
    commonChunks:{},
    commonPlugins:[],
    ExtractPlugin:[new ExtractTextPlugin('./css/main.css')],
    plugins: [],
    init:function(){
        var self=this;
        console.log("dist-NODE_ENV", process.env.NODE_ENV);
        self.getEntry();
        self.getOutput();
        self.getoutputChunks();
        self.getCommonPlugins();
        self.getPlugins();
    },
    getEntry:function(){
        var self=this;
        if(self.all_in_one){
            self.entry=self.one_js;
        }else{
            self.entry=self.all_js;
        }
    },
    getOutput:function(){
        var self=this;
        if(self.all_in_one){
            self.output={
                path: path.join(__dirname, 'dist/'), /*输出目录的配置，模板、样式、脚本、图片等资源的路径配置都相对于它*/
                publicPath: '', /*模板、样式、脚本、图片等资源对应的server上的路径,所有的资源引用添加头*/
                filename: 'js/main.js', /*每个页面对应的主js的生成配置*/
                chunkFilename: 'js/[chunkhash:8].js'   /*chunk生成的配置*/
            };
        }else{
            self.output= {
                path: path.join(__dirname, 'dist/'),
                publicPath: '',
                filename: 'js/[name].js',
                chunkFilename: 'js/[chunkhash:8].js'
            };
        }
    },
    getoutputChunks:function () {
        var self=this;
        var _chunks = [];
        for (var key in self.all_js) {
            _chunks.push(key);
        }
        self.commonChunks.chunks = _chunks;
        self.commonChunks.minChunks = _chunks.length;
    },
    getCommonPlugins: function () {
        var self=this;
        var _chunks=self.commonChunks.chunks,
            _minChunks=self.commonChunks.minChunks;
        self.commonPlugins=[new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: _chunks,
            minChunks: _minChunks
        }), new ExtractTextPlugin('./css/[name].css')];
    },
    getPlugins: function () {
        var self=this;
        if(self.all_in_one){
            self.plugins=self.plugins.concat(self.ExtractPlugin);
        }else{
            self.plugins=self.plugins.concat(self.commonPlugins);
        }
    }
};
preConfig.init();

var distConfigs = {
    devtool: false,
    entry: preConfig.entry,
    output: preConfig.output,
    plugins: [
        production,
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})/*压缩时不要打印警告*/
    ].concat(preConfig.plugins),
    module: {
        loaders: [ //加载器，关于各个加载器的参数配置，可自行搜索之。
            {
                test: /\.css$/,
                //配置css的抽取器、加载器。'-loader'可以省去
                loader: ExtractTextPlugin.extract('style', 'css', {publicPath: '../'}/*给css中的src引用添加地址头*/)
            }, {
                test: /\.less$/,
                //配置less的抽取器、加载器。中间!有必要解释一下，
                //根据从右到左的顺序依次调用less、css加载器，前一个的输出是后一个的输入
                //你也可以开发自己的loader哟。有关loader的写法可自行谷歌之。
                loader: ExtractTextPlugin.extract('css!less', {publicPath: '../'})
            }, {
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            }, {
                //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                //如下配置，将小于8192byte的图片转成base64码，
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=10240&name=images/[name].[ext]?[hash:8]'
                /*这里是css中图片的引用地址，并且也是相对于publish的存放地址。
                 在css中的效果就是  publish+url（因此要注意css的引用地址，及本身位置）*/
            },
            {
                //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
                //比如你配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
                test: /\.html$/,
                loader: "html?attrs=img:src img:data-src"/*这样会压缩html中的图片*/
            }
        ]
    },
    externals: [{
        /*不打包的库，html中使用CDN*/
        // 'jquery':"$"
        // 'react-dom': 'ReactDOM',
        // 'react': 'React'
    }],
    resolve: {
        extensions: ['', '.jsx', '.js', '.css', '.png', '.jpg'],
        modulesDirectories: ['shared', 'node_modules']
    },
    userOptions: {
        all_in_one: preConfig.all_in_one,
        chunks: preConfig.commonChunks.chunks,
        plugins: preConfig.plugins
    }
};
module.exports = distConfigs;