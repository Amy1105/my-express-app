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


### 认证中间件

在 Express 框架中实现用户名和密码认证，主要有几种方式，从简单的基本认证到更安全的现代化方案。
下面这个表格汇总了常见的选择和特点：

| 认证方式 | 适用场景 | 优点 | 缺点 |
| :--- | :--- | :--- | :--- |
| **基本认证 (Basic Auth)** | 内部工具、简单的 API 测试 | 配置简单，易于理解和实现 | **安全性很低**，密码以Base64编码（易解码）明文传输，必须配合HTTPS |
| **Passport.js 本地策略** | 成熟的Web应用，需要稳定、灵活的身份验证 | 生态丰富，支持多种认证策略（如OAuth、OpenID Connect），社区成熟 | 配置相对复杂，学习曲线稍陡 |
| **express-openid-connect** | 需要集成企业级单点登录（SSO）或第三方身份提供商（如Auth0）的应用 | 遵循OpenID Connect标准，简化了与专业认证服务的集成 | 依赖外部的身份提供商，概念较多 |

下面我们重点看看**基本认证 (Basic Auth)** 和 **Passport.js 本地策略**的具体使用方法。

### 🔐 基本认证 (Basic Auth)

`express-basic-auth` 是一个轻量级的中间件，适用于要求不高的内部场景。

首先，安装中间件：
```bash
npm install express-basic-auth
```

**见app-auth**

### 🔑 Passport.js 与本地策略

对于正式的 Web 应用，**Passport.js** 是更强大和安全的选择。它通过“策略”来支持各种认证方式，其中 `passport-local` 策略专门处理用户名和密码认证。

**安装必要的包：**
```bash
npm install passport passport-local
```

**基础配置示例：**
```javascript
const express = require('express');
const session = require('express-session'); // Passport 通常需要会话支持
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// 中间件设置
app.use(express.urlencoded({ extended: false })); // 用于解析登录表单提交的数据
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// 配置 Passport 本地策略
passport.use(new LocalStrategy(
    function(username, password, done) {
        // 1. 根据用户名查找用户（这里替换为你的数据库查询）
        User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            // 2. 用户不存在
            if (!user) {
                return done(null, false, { message: '用户名不正确。' });
            }
            // 3. 密码不匹配（这里应使用bcrypt等库进行哈希比对）
            if (!validPassword(user, password)) { // 替换为你的密码验证逻辑
                return done(null, false, { message: '密码不正确。' });
            }
            // 4. 认证成功，返回用户对象
            return done(null, user);
        });
    }
));

// 配置序列化和反序列化用户（用于在会话中存储和读取用户信息）
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// 定义路由
// 登录页面
app.get('/login', (req, res) => {
    res.send(`
        <form action="/login" method="post">
            <div>
                <label>用户名:</label>
                <input type="text" name="username"/>
            </div>
            <div>
                <label>密码:</label>
                <input type="password" name="password"/>
            </div>
            <div>
                <input type="submit" value="登录"/>
            </div>
        </form>
    `);
});

// 处理登录请求
app.post('/login', 
    passport.authenticate('local', { 
        successRedirect: '/dashboard', // 登录成功跳转
        failureRedirect: '/login',     // 登录失败跳转
        // failureFlash: true // 可选，配合connect-flash显示错误消息
    })
);

// 受保护的仪表板页面
app.get('/dashboard', (req, res) => {
    // 使用 `req.isAuthenticated()` 检查用户是否已登录
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    res.send(`欢迎回来，${req.user.username}！<a href="/logout">退出</a>`);
});

// 退出登录
app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(3000);
```

### ⚠️ 重要安全提醒

无论选择哪种方式，以下几点都至关重要：

1.  **永远使用 HTTPS**：在生产环境中，确保你的网站使用 HTTPS，特别是对于基本认证，以防止密码在传输过程中被窃听。
2.  **安全地存储密码**：**绝对不要**在数据库中以明文存储密码。应使用 **bcrypt** 这样的专业密码哈希算法，对密码进行加盐哈希处理。
3.  **会话安全**：使用 Passport.js 时，确保会话密钥 (`secret`) 是强大且保密的。

### 💎 如何选择

-   如果你的需求只是一个**极其简单、内部使用、无需考虑复杂安全性的工具**，可以尝试 `express-basic-auth`（务必搭配HTTPS）。
-   如果你在构建一个**面向公众的、需要用户注册登录的正式 Web 应用**，那么 **Passport.js 配合本地策略**是更可靠、更专业的选择。

希望这些解释和示例能帮助你理解如何在 Express 中实现用户名和密码认证！如果你对特定步骤（比如用 bcrypt 哈希密码）有更多疑问，我们可以继续深入探讨。