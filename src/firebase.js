import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// === 关键修改：导入 Analytics 模块 ===
import { getAnalytics } from "firebase/analytics";

// 安全配置检查
const validateFirebaseConfig = (config) => {
  const requiredFields = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  const missingFields = requiredFields.filter(field => !config[field]);

  if (missingFields.length > 0) {
    console.warn(`Firebase配置缺少以下字段: ${missingFields.join(', ')}`);
    console.warn('请检查环境变量配置或使用.env.example文件作为参考');

    // 如果是开发环境，使用默认配置（仅用于演示）
    if (import.meta.env.DEV) {
      console.warn('开发环境：使用演示配置，生产环境必须配置正确的环境变量');
      return {
        apiKey: "demo-api-key-for-development-only",
        authDomain: "demo.firebaseapp.com",
        projectId: "demo-project",
        storageBucket: "demo.appspot.com",
        messagingSenderId: "1234567890",
        appId: "1:1234567890:web:abcdef",
        measurementId: "G-XXXXXXXXXX"
      };
    }

    throw new Error(`Firebase配置不完整，缺少字段: ${missingFields.join(', ')}`);
  }

  return config;
};

// 从环境变量获取配置，如果不存在则使用硬编码配置（向后兼容）
const firebaseConfig = validateFirebaseConfig({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3eAuwDAKw1PrJ8ZkQo7j1sXy5foexE5w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "personal-website-a17a3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "personal-website-a17a3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "personal-website-a17a3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "423464979426",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:423464979426:web:65bf37a6554b55b3cf47bb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FN907GHGCC"
});

// 安全警告：如果使用默认配置，在控制台显示警告
if (!import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY.includes('your_api_key')) {
  console.warn('⚠️ 安全警告：正在使用默认或示例Firebase配置');
  console.warn('请创建.env.local文件并配置正确的Firebase凭证');
  console.warn('参考 .env.example 文件进行配置');
}

// 1. 初始化 Firebase 应用
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase应用初始化成功');
} catch (error) {
  console.error('Firebase初始化失败:', error);
  throw new Error('无法初始化Firebase应用，请检查配置');
}

// 2. 初始化 Analytics (仅在浏览器环境运行，防止 SSR 报错)
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    // 检查是否启用Analytics
    const enableAnalytics = import.meta.env.VITE_ENABLE_ANALYTICS !== 'false';
    if (enableAnalytics) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics初始化成功');
    } else {
      console.log('Firebase Analytics已禁用');
    }
  } catch (error) {
    console.warn('Firebase Analytics初始化失败:', error);
  }
}

// 3. 导出 Auth 和 Firestore 供 App.jsx 使用
let auth, db;
try {
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('Firebase Auth和Firestore初始化成功');
} catch (error) {
  console.error('Firebase服务初始化失败:', error);
  throw new Error('无法初始化Firebase服务');
}

// 4. 安全导出（防止未初始化时使用）
export { auth, db, analytics };
export default app;
