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


var app = express();

//中间件顺序：
app.use(logger('dev'));
//指定日志的输出格式，这是 morgan 中间件（通常变量名就叫 logger）的预定义日志格式
//

//1.后续中间件可能需要解析后的请求数据（如请求体、Cookie）
app.use(express.urlencoded({ extended: false })); // 解析表单提交的数据
app.use(express.json()); // 解析 JSON 数据
app.use(cookieParser());

// 配置会话（Passport 依赖会话来持久化登录状态）
app.use(session({
  secret: 'your-secret-key', // 用于签名会话ID cookie的密钥，请使用一个复杂的字符串
  resave: false,
  saveUninitialized: false
}));


//2、静态文件
app.use(express.static(path.join(__dirname, 'public'))); 

//3、日志记录、通用权限检查

// view engine setup
app.set('views', path.join(__dirname, 'views')); //告诉 Express"模板文件在哪里"
//app.set('view engine', 'jade'); //告诉 Express"使用哪种模板引擎"
app.set('view engine', 'ejs');


// 3. 初始化 Passport 并使其与会话协同工作
app.use(passport.initialize());
app.use(passport.session());


// 执行 Passport 配置（传入 passport 实例）
require('./middleware/passport')(passport);


//4.路由配置
// 将路由挂载到应用上
// 现在所有在 router.js 中定义的路由（如 /login, /dashboard）都会生效
app.use('/', router); 
// 所有以 '/' 开头的请求都会交给 indexRouter 处理
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// 将所有路由作为一个整体中间件使用
// 这一行就相当于注册了所有的路由规则
app.use(allRoutes);



// 5.异常处理 error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 6.404处理 catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


const port = 3000;

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});

module.exports = app;
