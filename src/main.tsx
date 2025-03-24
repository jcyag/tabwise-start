
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 等待 DOM 完全加载
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById("root");
  
  if (rootElement) {
    console.log("DOM loaded, rendering app...");
    createRoot(rootElement).render(<App />);
  } else {
    console.error("Root element not found!");
  }
});
