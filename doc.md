# 项目构建

## init 
```bash

# 1. 创建一个你的项目目录并进入
mkdir my-express-app
cd my-express-app

# 2. 初始化项目，会生成一个 package.json 文件
npm init -y

```

## 安装express

```bash
# 安装 Express 并将其保存到 package.json 的 dependencies 中
npm install express

```

## 编写最小化 Express 应用代码

``` javascript
// 1. 导入 express 模块
const express = require('express');

// 2. 创建一个 Express 应用实例
const app = express();

// 3. 定义端口号
const port = 3000;

// 4. 定义一个最简单的路由
// 当用户以 GET 方式访问根路径 '/' 时，执行后面的回调函数
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// 5. 启动服务器，监听指定端口
app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

```

## 应用程序生成器  在Node.js 8.2.0以上可用
``` bash

npx express-generator

```

## 路由

## 中间件

## 各种中间件 