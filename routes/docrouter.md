### 核心概念
#### 首先，理解几个关键概念：

**视图引擎 (View Engine)**：Express 本身不具备渲染 HTML 的能力，它依赖于第三方模板引擎（如 EJS, Pug, Handlebars）。视图引擎负责将模板文件（带有特殊语法的文本文件）和数据结合，最终生成标准的 HTML 发送给浏览器。
**视图目录 (Views Directory)**：这是你存放所有模板文件的地方。Express 默认会在项目根目录下寻找一个名为 views 的文件夹。
**路由 (Router)**：路由决定了应用程序如何响应客户端对特定端点（URL）的请求。我们将在路由处理函数中，调用 res.render() 方法来指定要渲染哪个视图，并传递数据给它。

```bash
# 安装ejs视图渲染器
npm install ejs
```



```javascript
//在 app.js 中，我们需要完成两件事：
//1、设置视图引擎。
//2、设置视图文件的存放目录（如果不是默认的 views）
const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index'); // 引入路由模块

const app = express();
const port = 3000;

// 1. 配置视图引擎为 EJS
// Express 会自动 require('ejs')
app.set('view engine', 'ejs');

// 2. 配置视图目录
// __dirname 是当前文件所在的目录
// path.join(__dirname, 'views') 确保了路径在任何操作系统下都正确
// 如果你的视图文件夹就叫 'views' 并且在根目录，这行可以省略，因为它是默认值
app.set('views', path.join(__dirname, 'views'));

// 使用路由
// 所有以 '/' 开头的请求都会交给 indexRouter 处理
app.use('/', indexRouter);

// 启动服务器
app.listen(port, () => {
  console.log(`Express server is running at http://localhost:${port}`);
});
```

```javascript
// app.js
const express = require('express');
const path = require('path');
const allRoutes = require('./routes'); // 引入聚合后的路由

const app = express();
const port = 3000;

// ... 其他全局配置，如视图引擎、静态文件目录等 ...
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 将所有路由作为一个整体中间件使用
// 这一行就相当于注册了所有的路由规则
app.use(allRoutes);

// ... 错误处理中间件 ...
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器内部错误！');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

```