
import { useState, useEffect, useRef } from "react";
import { validateUrl } from "../utils/helpers";

export const useBookmarkForm = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [userEditedName, setUserEditedName] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Validate URL and extract name when URL changes, but with debounce
  useEffect(() => {
    // Don't do anything if the URL is empty
    if (!url) {
      setIsValid(false);
      return;
    }

    // Normalize URL for validation
    let urlToValidate = url;
    if (!/^https?:\/\//i.test(url)) {
      urlToValidate = "http://" + url;
    }
    
    // Validate URL
    const valid = validateUrl(urlToValidate);
    setIsValid(valid);
    
    // Only extract name if URL is valid and user hasn't edited the name field
    if (valid && url.trim() !== "" && !userEditedName) {
      try {
        const domain = new URL(urlToValidate).hostname.replace("www.", "");
        const domainParts = domain.split(".");
        if (domainParts.length > 0) {
          const siteName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
          setName(siteName);
        }
      } catch (e) {
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
    setIsValid(false);
  };

  return {
    url,
    name,
    isValid,
    isFetching,
    userEditedName,
    urlInputRef,
    handleUrlChange,
    handleNameChange,
    resetForm
  };
};
