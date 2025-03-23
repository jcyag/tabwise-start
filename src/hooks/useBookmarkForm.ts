
import { useState, useEffect, useRef } from "react";

export const useBookmarkForm = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(true); // Always valid by default now
  const [isFetching, setIsFetching] = useState(false);
  const [userEditedName, setUserEditedName] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Extract name from URL when URL changes (but only if user hasn't edited name)
  useEffect(() => {
    // Don't do anything if the URL is empty
    if (!url || userEditedName) {
      return;
    }
    
    // Only try to extract domain name if URL has some content
    if (url.trim() !== "") {
      try {
        // Simple domain extraction without validation
        let urlToProcess = url;
        if (!/^https?:\/\//i.test(url)) {
          urlToProcess = "http://" + url;
        }
        
        const domain = new URL(urlToProcess).hostname.replace("www.", "");
        const domainParts = domain.split(".");
        if (domainParts.length > 0) {
          const siteName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
          setName(siteName);
        }
      } catch (e) {
        // If URL parsing fails, don't change the name
        console.log("Failed to extract domain:", e);
      }
    }
  }, [url, userEditedName]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
  };

  const handleNameChange = (value: string) => {
    setName(value);
    setUserEditedName(true);
  };

  const resetForm = () => {
    setUrl("");
    setName("");
    setUserEditedName(false);
    setIsValid(true);
  };

  return {
    url,
    name,
    isValid, // Always true now
    isFetching,
    userEditedName,
    urlInputRef,
    handleUrlChange,
    handleNameChange,
    resetForm
  };
};
