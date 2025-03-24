
/// <reference types="vite/client" />

// Chrome extension API type definitions
interface Chrome {
  extension?: {
    getURL: (path: string) => string;
  };
  runtime?: {
    lastError?: { message: string };
    onInstalled?: { addListener: (callback: () => void) => void };
    onMessage?: { 
      addListener: (
        callback: (
          message: any, 
          sender: any, 
          sendResponse: (response?: any) => void
        ) => void | boolean
      ) => void 
    };
    onError?: { addListener: (callback: (error: any) => void) => void };
  };
  history?: {
    search: (
      query: {
        text: string;
        maxResults?: number;
        startTime?: number;
      },
      callback: (results: ChromeHistoryItem[]) => void
    ) => void;
  };
  bookmarks?: {
    getTree: (callback: (results: any) => void) => void;
  };
}

interface ChromeHistoryItem {
  id: string;
  url?: string;
  title?: string;
  lastVisitTime?: number;
  visitCount?: number;
}

// Declare chrome as a global variable
declare global {
  interface Window {
    chrome?: Chrome;
  }
}

// For non-module scripts
declare const chrome: Chrome | undefined;
