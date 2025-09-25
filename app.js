var createError = require('http-errors');
var express = require('express');
var path = require('path');

//passport
const session = require('express-session'); // Passport 通常需要会话支持
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//passport

var cookieParser = require('cookie-parser');
var logger = require('morgan');

const allRoutes = require('./routes'); // 引入聚合后的路由

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();


// 1. 配置视图引擎为 EJS
// Express 会自动 require('ejs')
app.set('view engine', 'ejs');

// 2. 配置视图目录
// __dirname 是当前文件所在的目录
// path.join(__dirname, 'views') 确保了路径在任何操作系统下都正确
// 如果你的视图文件夹就叫 'views' 并且在根目录，这行可以省略，因为它是默认值
app.set('views', path.join(__dirname, 'views'));


//passport中间件设置
app.use(express.urlencoded({ extended: false })); // 用于解析登录表单提交的数据
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
//passport中间件设置

app.use('/static', express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



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

// 所有以 '/' 开头的请求都会交给 indexRouter 处理
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// 将所有路由作为一个整体中间件使用
// 这一行就相当于注册了所有的路由规则
app.use(allRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



const port = 3000;

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

module.exports = app;
