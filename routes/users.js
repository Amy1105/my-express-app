// routes/users.js
const express = require('express');
const router = express.Router();

// 注意这里的路径是相对的

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/', (req, res) => {
  res.send('获取所有用户列表');
});

router.get('/:id', (req, res) => {
  res.send(`获取 ID 为 ${req.params.id} 的用户信息`);
});

router.post('/', (req, res) => {
  res.send('创建新用户');
});

module.exports = router;