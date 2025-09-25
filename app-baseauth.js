const express = require('express');
const basicAuth = require('express-basic-auth');

const app = express();

// 1. 简单的静态用户名和密码
app.use(basicAuth({
    users: { 'admin': 'supersecretpassword' },
    challenge: true, // 浏览器弹出认证对话框
    realm: 'My Application Realm' // 标识受保护区域的名称为`realm`
}));

// 2. 自定义认证逻辑（例如，验证数据库中的用户）
app.use(basicAuth({
    authorizer: myAsyncAuthorizer,
    authorizeAsync: true, // 使用异步验证
    challenge: true,
    realm: 'My App'
}));

// 自定义认证函数示例
function myAsyncAuthorizer(username, password, callback) {
    // 这里替换为你的数据库查询逻辑
    if (username === 'admin' && password === 'secret') {
        return callback(null, true);
    } else {
        return callback(null, false);
    }
}

// 受保护的路由
app.get('/protected', (req, res) => {
    res.send('你好，认证用户！');
});

app.listen(3000);