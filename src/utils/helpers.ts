
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const validateUrl = (url: string): boolean => {
  try {
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const extractDomain = (url: string): string => {
  try {
    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch (e) {
    return url;
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return '';
  }
};

export const postMessageToIframes = (message: any): void => {
  try {
    // Try to send messages to all iframes
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      try {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(message, '*');
        }
      } catch (err) {
        console.error('Error sending message to iframe:', err);
      }
    });
  } catch (e) {
    console.error('Error in postMessageToIframes:', e);
  }
};

// Safely get favicon URL for a domain
export const getFaviconUrl = (url: string): string => {
  try {
    const domain = extractDomain(url);
    return `https://www.google.com/s2/favicons?domain=${domain}`;
  } catch (e) {
    return 'https://www.google.com/favicon.ico'; // Default favicon
  }
};

// Check if running in Chrome extension context
export const isExtensionContext = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.extension;
};
