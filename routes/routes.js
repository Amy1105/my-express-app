// routes.js

const express = require('express');
const router = express.Router(); // 创建一个主路由容器

// 引入所有模块路由
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');

// 导入一个简单的辅助函数，用于检查用户是否已登录（可选）
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // 用户已认证，继续下一个处理环节
  }
  // 用户未认证，重定向到登录页  
  res.redirect('/login');
};

// 登录页面 (GET 请求)
router.get('/login', (req, res) => {
  res.send(`
    <h1>登录</h1>
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
    <a href="/dashboard">看Dashboard</a>
  `);
});

// 处理登录请求 (POST 请求)
// 使用 passport.authenticate 中间件，指定 'local' 策略
router.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/dashboard',   // 认证成功跳转到仪表板
    failureRedirect: '/login',       // 认证失败跳转回登录页
    // failureFlash: true            // (可选) 如果需要使用闪存消息提示错误
  })
);

// 受保护的仪表板页面，使用 ensureAuthenticated 中间件保护
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  // 认证成功后，用户信息会保存在 req.user 中
  res.send(`<h1>Dashboard</h1><p>你好, ${req.user.username}!</p><a href="/logout">退出登录</a>`);
});

// 退出登录
router.get('/logout', (req, res, next) => {
  req.logout(function(err) { // Passport v0.6.0 后需要传入回调函数
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// 首页（可根据是否登录显示不同内容）
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// 在主路由容器上挂载各个模块路由
router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);


// 可以在这里统一处理 404
router.use((req, res, next) => {
  res.status(404).send('抱歉，找不到这个页面！');
});

module.exports = router;