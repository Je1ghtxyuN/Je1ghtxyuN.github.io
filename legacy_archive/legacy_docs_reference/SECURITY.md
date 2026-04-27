# 安全措施指南

## 已实施的安全措施

### 1. 输入验证和清理
- **日期格式化工具**: 创建了 `src/utils/dateFormatter.js` 来处理各种日期格式，防止无效日期显示
- **数据验证**: 在数据提交前进行基本验证（标题、内容不能为空）

### 2. 认证和授权
- **Firebase Authentication**: 使用Firebase进行用户认证
- **匿名登录**: 默认使用匿名登录，保护用户隐私
- **管理员认证**: 只有认证用户才能进行编辑、删除操作
- **权限检查**: 在客户端检查用户权限，防止未授权操作

### 3. 数据安全
- **Firestore安全规则**: 需要在Firebase控制台配置适当的安全规则
- **本地缓存**: 使用localStorage进行数据缓存，但包含过期时间
- **降级处理**: 网络不可用时使用本地缓存，避免服务中断

### 4. 前端安全
- **React Markdown安全渲染**: 使用ReactMarkdown安全渲染Markdown内容
- **XSS防护**: 避免直接使用innerHTML，使用React的安全渲染
- **CSP兼容**: 确保代码与Content Security Policy兼容

## 需要配置的Firebase安全规则

### Firestore安全规则建议

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 公共数据 - 只读访问
    match /artifacts/je1ght-space-v3/public/data/{collection}/{document} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email_verified == true;
    }
    
    // 个人资料 - 只读访问
    match /artifacts/je1ght-space-v3/public/profile {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email_verified == true;
    }
    
    // 评论 - 任何人都可以创建，但只有管理员可以删除
    match /artifacts/je1ght-space-v3/public/data/posts/{postId}/comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.token.email_verified == true;
    }
    
    // 点赞 - 每个用户只能点赞一次
    match /artifacts/je1ght-space-v3/public/data/posts/{postId}/likes/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Firebase Authentication设置建议

1. **启用电子邮件/密码认证**
2. **启用匿名认证**（已启用）
3. **配置电子邮件验证**（建议启用）
4. **设置密码重置功能**
5. **配置会话管理**（默认设置）

## 环境变量安全

### 建议的.env文件配置
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 更新firebase.js使用环境变量
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

## 其他安全建议

### 1. 定期更新依赖
```bash
npm audit
npm update
```

### 2. 启用HTTPS
- 确保网站通过HTTPS提供服务
- 配置HTTP到HTTPS的重定向

### 3. 监控和日志
- 启用Firebase Analytics进行使用情况监控
- 配置错误监控（如Sentry）
- 定期检查Firebase控制台的审计日志

### 4. 备份策略
- 定期备份Firestore数据
- 配置自动备份（通过Firebase控制台）

### 5. 速率限制
- 考虑在Firebase安全规则中添加速率限制
- 监控异常活动

## 紧急响应

### 如果发现安全漏洞
1. **立即禁用受影响的功能**
2. **检查日志**确定影响范围
3. **更新安全规则**修复漏洞
4. **通知用户**如果用户数据可能受到影响
5. **更新代码**修复根本原因

### 联系信息
- 项目维护者: Je1ghtxyuN
- GitHub仓库: https://github.com/Je1ghtxyuN/Je1ghtxyuN.github.io
- 安全问题报告: 通过GitHub Issues报告

---

*最后更新: 2026年3月6日*
*版本: 1.0*