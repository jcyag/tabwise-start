
import { useState, useEffect, useRef } from "react";

export const useBookmarkForm = () => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [userEditedName, setUserEditedName] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // 当URL变化且值不为空，且用户没有编辑名称时，尝试提取域名作为名称
  useEffect(() => {
    if (url && !userEditedName) {
      try {
        // 简单的域名提取，不做验证
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
        // 如果URL解析失败，不更改名称
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
    isValid,
    isFetching,
    userEditedName,
    urlInputRef,
    handleUrlChange,
    handleNameChange,
    resetForm
  };
};
