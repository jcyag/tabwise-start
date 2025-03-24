
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 检查是否在扩展环境中
const isExtensionEnvironment = typeof window !== 'undefined' && 
                               'chrome' in window && 
                               window.chrome !== undefined && 
                               typeof window.chrome.runtime !== 'undefined';

// 记录环境信息以便调试
console.log("Environment:", {
  isExtension: isExtensionEnvironment,
  userAgent: navigator.userAgent,
  windowLocation: window.location.href
});

// 初始化应用
const initApp = () => {
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    console.log("Root element found, rendering app...");
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element not found! Retrying in 100ms...");
    // 如果DOM元素不存在，稍后重试
    setTimeout(initApp, 100);
  }
};

// 等待DOM完全加载后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // 如果DOM已经加载完成，直接初始化
  initApp();
}
