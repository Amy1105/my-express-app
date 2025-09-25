

### 🔑 `express-basic-auth`  认证信息的传输方式

通过 HTTP 请求头（Header）进行传输。这是 HTTP 基本认证（Basic Authentication）的标准协议。

当您设置了 `challenge: true` 时，浏览器在首次访问受保护的路由时会自动弹出一个登录对话框。您在这个对话框中输入的用户名和密码，浏览器会自动将其处理后，放在 **`Authorization`** 请求头中发送给服务器。

其具体格式如下：
1.  浏览器将用户名和密码用冒号连接（例如：`admin:supersecretpassword`）。
2.  将这个字符串进行 **Base64 编码**。
3.  在编码后的字符串前加上 `Basic `（注意有一个空格），最终形成完整的请求头值。

一个完整的请求头看起来是这样的：
```
Authorization: Basic YWRtaW46c3VwZXJzZWNyZXRwYXNzd29yZA==
```

下面的流程图清晰地展示了浏览器与服务器之间完成基本认证的交互过程：

```mermaid
flowchart TD
    A[客户端访问受保护路由] --> B{请求头中包含<br>有效Authorization信息?}
    B -- 否 --> C[服务器返回401状态码<br>并携带WWW-Authenticate头]
    C --> D[浏览器弹出认证对话框]
    D --> E[用户输入用户名/密码]
    E --> F[浏览器自动编码信息<br>并放入Authorization头重发请求]
    F --> B
    B -- 是 --> G[认证成功<br>访问受保护资源]
```

### 💻 手动设置认证头的方法

如果不是在浏览器环境中（例如，使用 API 测试工具如 Postman，或通过代码发送请求），您需要手动构建这个 `Authorization` 请求头。

这里以 **Postman** 和 **Node.js 代码**为例：

*   **在 Postman 中设置：**
    1.  进入请求的 "Headers" 标签页。
    2.  添加一个键（Key）为 `Authorization` 的请求头。
    3.  值（Value）为 `Basic <您的Base64编码字符串>`。您可以直接计算好 `admin:supersecretpassword` 的 Base64 编码（`YWRtaW46c3VwZXJzZWNyZXRwYXNzd29yZA==`），也可以使用 Postman 的 "Authorization" 标签，选择 "Basic Auth" 类型并直接填写用户名和密码，它会自动帮您完成编码和设置。

*   **在 Node.js 代码中（使用原生 `http` 模块示例）：**
    ```javascript
    const http = require('http');
    // 对 '用户名:密码' 进行 Base64 编码
    const credentials = Buffer.from('admin:supersecretpassword').toString('base64');

    const options = {
      hostname: 'your-server.com',
      port: 3000,
      path: '/your-protected-route',
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}` // 将编码后的凭证放入请求头
      }
    };

    const req = http.request(options, (res) => {
      // 处理响应...
    });
    req.end();
    ```
    

### ⚠️ 重要提示

1.  **安全性考虑**：HTTP 基本认证中，密码仅经过 Base64 编码（这相当于明文），并未加密。因此，**在生产环境中务必使用 HTTPS（SSL/TLS）** 来加密整个通信过程，防止密码被窃听。
2.  **不要放入请求体**：您不需要也不应该将用于基本认证的用户名和密码作为 JSON 或表单数据放在请求体（Body）中。`express-basic-auth` 中间件只会从 `Authorization` 请求头中读取并验证信息。

希望这些解释能帮助您清晰地理解认证信息的传递方式！如果您在实践过程中遇到其他问题，随时可以再问我。