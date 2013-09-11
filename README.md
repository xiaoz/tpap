tpap
==========

for caja, a third parth adapter.

    caja 是google开发的安全技术框架 https://code.google.com/p/google-caja/
    开放JS 是基于caja的修改版，更适合公司的应用。 框架 https://github.com/lorrylockie/caja
    tpap 是基于开放JS的一个适配器，让第三方可以在开放JS中安全的使用KISSY相关特性。是kissy的一个第三方安全策略方案。
    目前项目中也有关于第三方适配的代码(阿里云和jssdk)


目前tpap和开放JS应用于淘宝的旺铺模板开发，淘宝U站，品牌中心，聚石塔等业务

#### 一些知识
https://github.com/lorrylockie/tpap/issues



#### 有问题

欢迎[提issue](https://github.com/lorrylockie/caja/issues/new)， 我会第一时间回复

#### WIKI

也欢迎你贡献 [wiki](https://github.com/lorrylockie/tpap/wiki)


#### 目录结构说明

utf8 编码

* assets 前端源代码
* assets/base tpap的一些基础环境工具
* asssets/openjs tpap的适配模块代码，代码中有详细的注释。适配过程中可以参考一些其他模块。模块的适配已经规范化
* assets/widgets 一些公共的js服务。目前是switchable的根据html自动初始化组件

* testcase 测试用例编写目录
* testcase/index.php 测试用例索引目录
* testcase/README 如何编写测试用例说明
* testcase common 为基础的页头页尾，每个测试用例需要引入common中的head和foot文件作为基础环境，并且调用cajoled_service.php 作为js的编译服务。
* testcase 1.3.0/gallery/thirdparty 基本和assets/openjs 目录对应
* test 测试代码库，目前里面只有一个js，提供一个很简单的类似于jasmine的api


#### 代码运行
* 将项目目录，放到php 服务器中，访问index.php
* 编写完适配代码，`grunt`, 项目打包