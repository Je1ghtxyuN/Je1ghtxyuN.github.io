import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// === 关键修改：导入 Analytics 模块 ===
import { getAnalytics } from "firebase/analytics"; 

const firebaseConfig = {
    apiKey: "AIzaSyB3eAuwDAKw1PrJ8ZkQo7j1sXy5foexE5w",
    authDomain: "personal-website-a17a3.firebaseapp.com",
    projectId: "personal-website-a17a3",
    storageBucket: "personal-website-a17a3.firebasestorage.app",
    messagingSenderId: "423464979426",
    appId: "1:423464979426:web:65bf37a6554b55b3cf47bb",
    measurementId: "G-FN907GHGCC"
};

// 1. 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);

// 2. 初始化 Analytics (仅在浏览器环境运行，防止 SSR 报错)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// 3. 导出 Auth 和 Firestore 供 App.jsx 使用
export const auth = getAuth(app);
export const db = getFirestore(app);
// 导出 analytics 以便后续扩展使用
export { analytics };

export default app;