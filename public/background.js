
// Background script for the Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Elegant New Tab extension installed');
});

// 监听错误以便调试
chrome.runtime.onError.addListener((error) => {
  console.error('Extension error:', error.message);
});

// 添加消息监听，用于跨组件通信
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);
  
  if (message.action === 'getHistory') {
    chrome.history.search({ text: '', maxResults: 10 }, (results) => {
      sendResponse({ history: results });
    });
    return true; // 保持消息通道开放以进行异步响应
  }
  
  if (message.action === 'getBookmarks') {
    chrome.bookmarks.getTree((results) => {
      sendResponse({ bookmarks: results });
    });
    return true; // 保持消息通道开放以进行异步响应
  }
});
