/*用以启动Webpack开发服务器*/
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  color:true,/*命令行中显示颜色！*/
  historyApiFallback: true,
  inline: true,
  progress: true/*显示合并代码进度*/
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:3000');
});