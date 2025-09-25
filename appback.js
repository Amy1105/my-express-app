var createError = require('http-errors');
var express = require('express');
var path = require('path');
const basicAuth = require('express-basic-auth');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(basicAuth({
    users: { 'admin': 'supersecretpassword' },
    challenge: true, // 浏览器弹出认证对话框
    realm: 'My Application Realm' // 标识受保护区域的名称为`realm`
}));

app.use('/static', express.static('public'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//中间件
// app.post('/', (req, res) => {
//   res.send('Got a POST request')
// })

app.get('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user')
})

// app.delete('/user', (req, res) => {
//   res.send('Got a DELETE request at /user')
// })

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
