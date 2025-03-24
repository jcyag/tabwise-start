
import { Link } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useRef, useEffect } from "react";

interface UrlInputProps {
  url: string;
  onChange: (value: string) => void;
  isValid: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const UrlInput = ({ url, onChange, isValid, inputRef }: UrlInputProps) => {
  // 使用本地状态跟踪输入值
  const [inputValue, setInputValue] = useState(url || "");
  const localInputRef = useRef<HTMLInputElement>(null);
  const effectiveRef = inputRef || localInputRef;
  
  // 在组件挂载和url属性初始化或更新时设置值
  useEffect(() => {
    if (url !== undefined && url !== null) {
      setInputValue(url);
    }
  }, [url]);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          ref={effectiveRef}
          type="text"
          id="url"
          value={inputValue}
          onChange={handleChange}
          className="w-full pl-10 pr-4"
          placeholder="https://example.com"
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default UrlInput;
