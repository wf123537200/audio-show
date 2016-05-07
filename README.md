前端集成环境部署方案
	每次开发提交代码后，jenkins环境自动从git流拉取代码，然后执行各种编译命令，执行完命令启动服务，则可以正常访问

前端集成环境部署依赖软件：
	1. 最新稳定版的node
	2. 最新稳定版的ruby,安装完ruby，然后执行如下命令，安装sass和compass
		安装scss命令: gem install sass
		按照compass命令：sudo gem install compass
	3. 安装webpack
		命令： npm install -g webpack

前端代码操作：
	a.在“cjds-web-main\src\main\webapp”下建立一个web目录，然后将前端代码的master流拷贝到该web目录下面
	b. 在web目录下，执行npm install  （也可以使用npm的淘宝镜像，cnpm install安装，不过要执行镜像安装命令）
	c. 在web/src目录下执行如下命令，编译项目内的scss文件
		compass compile --force
	d. 在web目录下执行如下命令，使用webpack打包前端代码
		webpack
	备注：如上四步是第一次搭建环境的时候的操作，第一次环境搭建完毕以后，如果前端master流上代码修改了，只需要从master流上拉取代码覆盖到web目录，然后执行“步骤c”和“步骤d”即可，不需要清空web目录，然后执行如上“a,b,c,d”四个步骤


---------前端开发常用地址---------

前端库地址：http://192.168.1.59:3000/cjds/web.git

开发修改了dev的代码后，可以到如下“测试集成环境地址”进行构建：
http://192.168.1.37:8080/view/3%E9%9B%86%E6%88%90%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83/job/web1-testjc-120.26.130.4/
admin / 123456

测试集成环境地址（ip和域名访问形式）：
http://120.26.130.4/src/pages/login/index.html
http://testjc.my.yunlai.cn/src/pages/login/index.html
账号密码
shuo/wind
wind/wind
zak/wind
han/wind
xiaozhi/wind
ido/wind
eddie/wind


window.remoteOrigin = 'http://192.168.1.36';