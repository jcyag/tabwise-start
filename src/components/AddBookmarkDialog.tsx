
import { useState, useEffect, useRef } from "react";
import { X, Link, Edit } from "lucide-react";
import { Input } from "./ui/input";
import { validateUrl, extractDomain } from "../utils/helpers";

interface AddBookmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string, name: string) => void;
  groupId: string;
}

const AddBookmarkDialog = ({ isOpen, onClose, onAdd, groupId }: AddBookmarkDialogProps) => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [userEditedName, setUserEditedName] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && urlInputRef.current) {
      urlInputRef.current.focus();
    }
    
    // Reset states when dialog opens
    if (isOpen) {
      setUrl("");
      setName("");
      setUserEditedName(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    // Validate URL as user types
    try {
      if (url) {
        // Add http:// if missing
        let urlToValidate = url;
        if (!/^https?:\/\//i.test(url)) {
          urlToValidate = "http://" + url;
        }
        
        new URL(urlToValidate);
        setIsValid(true);
        
        // Try to fetch page title if URL is valid and user hasn't edited the name
        if (url !== "" && name === "" && !userEditedName) {
          setIsFetching(true);
          
          // In a real extension, we would use chrome APIs to get page info
          // For the demo, we'll extract domain name as title
          try {
            const domain = new URL(urlToValidate).hostname.replace("www.", "");
            const domainParts = domain.split(".");
            if (domainParts.length > 0) {
              // Capitalize the first letter of the domain name
              const siteName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
              setName(siteName);
            }
          } catch (e) {
            // If extraction fails, leave name empty
          }
          
          setIsFetching(false);
        }
      } else {
        setIsValid(false);
      }
    } catch (e) {
      setIsValid(false);
    }
  }, [url, name, userEditedName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    // Ensure URL has protocol
    let finalUrl = url;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "http://" + finalUrl;
    }
    
    onAdd(finalUrl, name || new URL(finalUrl).hostname);
    
    // Reset form
    setUrl("");
    setName("");
    setUserEditedName(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setUserEditedName(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden animate-fade-in"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Add Bookmark</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link size={16} className="text-gray-400" />
              </div>
              <Input
                ref={urlInputRef}
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${
                  url && !isValid
                    ? "border-red-300 focus:ring-red-200"
                    : ""
                }`}
                placeholder="https://example.com"
              />
            </div>
            {url && !isValid && (
              <p className="mt-1 text-sm text-red-500">Please enter a valid URL</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Edit size={16} className="text-gray-400" />
              </div>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className="w-full pl-10 pr-4 py-2"
                placeholder="Bookmark name"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Add Bookmark
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookmarkDialog;
