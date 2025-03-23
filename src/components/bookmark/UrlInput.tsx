
import { Link } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";

interface UrlInputProps {
  url: string;
  onChange: (value: string) => void;
  isValid: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const UrlInput = ({ url, onChange, isValid, inputRef }: UrlInputProps) => {
  // Add local state to handle input value
  const [inputValue, setInputValue] = useState(url);

  // Update local state when prop changes
  useEffect(() => {
    setInputValue(url);
  }, [url]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
        URL
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Link size={16} className="text-gray-400" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          id="url"
          value={inputValue}
          onChange={handleInputChange}
          className={`w-full pl-10 pr-4 ${
            inputValue && !isValid
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          }`}
          placeholder="https://example.com"
          autoComplete="off"
        />
      </div>
      {inputValue && !isValid && (
        <p className="mt-1 text-sm text-red-500">Please enter a valid URL</p>
      )}
    </div>
  );
};

export default UrlInput;
