// middleware/passport.js
const LocalStrategy = require('passport-local').Strategy;
// 这里假设你有一个用户模型（例如通过 Mongoose 定义），用于查找用户
const User = require('../models/User'); 

module.exports = function(passport) {
  // 配置 "local" 策略
  passport.use(new LocalStrategy(
    function(username, password, done) {
      // 1. 根据用户名查找用户
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        // 2. 如果没找到用户
        if (!user) {
          return done(null, false, { message: '用户名不存在。' });
        }
        // 3. 验证密码（假设 User 模型有一个 validPassword 方法）
        // !!! 重要：在实际应用中，务必使用 bcrypt 等库进行密码哈希比对
        if (!user.validPassword(password)) {
          return done(null, false, { message: '密码错误。' });
        }
        // 4. 认证成功，返回用户对象
        return done(null, user);
      });
    }
  ));

  // 序列化用户：决定将用户信息中的哪个数据存入会话（通常只存id）
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // 反序列化用户：通过会话中存储的数据（如id）还原完整的用户信息
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};