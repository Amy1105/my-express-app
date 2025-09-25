// routes.js

const express = require('express');
const router = express.Router(); // 创建一个主路由容器

// 引入所有模块路由
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');

// 在主路由容器上挂载各个模块路由
router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);

// 可以在这里统一处理 404
router.use((req, res, next) => {
  res.status(404).send('抱歉，找不到这个页面！');
});

module.exports = router;