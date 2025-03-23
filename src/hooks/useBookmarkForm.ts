
import { useState, useEffect, useRef } from "react";
import { validateUrl } from "../utils/helpers";

export const useBookmarkForm = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [userEditedName, setUserEditedName] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (url) {
        let urlToValidate = url;
        if (!/^https?:\/\//i.test(url)) {
          urlToValidate = "http://" + url;
        }
        
        // Use the validateUrl helper function
        const valid = validateUrl(urlToValidate);
        setIsValid(valid);
        
        if (valid && url !== "" && name === "" && !userEditedName) {
          setIsFetching(true);
          
          try {
            const domain = new URL(urlToValidate).hostname.replace("www.", "");
            const domainParts = domain.split(".");
            if (domainParts.length > 0) {
              const siteName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
              setName(siteName);
            }
          } catch (e) {
            // If extraction fails, leave name empty
            console.log("Failed to extract domain:", e);
          }
          
          setIsFetching(false);
        }
      } else {
        setIsValid(false);
      }
    } catch (e) {
      console.log("URL validation error:", e);
      setIsValid(false);
    }
  }, [url, name, userEditedName]);

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
