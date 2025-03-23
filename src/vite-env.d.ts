
/// <reference types="vite/client" />

// Chrome extension API type definitions
interface Chrome {
  extension?: {
    getURL: (path: string) => string;
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
}

interface ChromeHistoryItem {
  id: string;
  url?: string;
  title?: string;
  lastVisitTime?: number;
  visitCount?: number;
}

// Make chrome available in the global scope
declare const chrome: Chrome | undefined;
