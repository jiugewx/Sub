
----------------
npm install

webpack
webpack-dev-server要--save的方式安装,其他的都会出错!

npm run dev  这个可以热加载,开启8080端口

npm start  开启3000端口


git rm -r --cached .
git add .
git commit -m "new!"

手机端的console.log

安装weinre
sudo npm install -g weinre

查看本机IP
ipconfig getifaddr en0

启动服务,默认为8080端口
weinre --boundHost 10.13.55.9

浏览器打开http://10.13.55.9:8080/

给需要调试的页面添加
<script src="http://10.13.55.9:8080/target/target-script-min.js#anonymous"></script>

手机端打开需要调试的页面,即可以在PC调试

