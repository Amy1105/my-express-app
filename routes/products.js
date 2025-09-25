// routes/products.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('获取所有产品列表');
});

router.get('/:id', (req, res) => {
  res.send(`获取 ID 为 ${req.params.id} 的产品信息`);
});

module.exports = router;