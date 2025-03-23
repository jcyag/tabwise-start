
import { Edit } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useRef, useEffect } from "react";

interface NameInputProps {
  name: string;
  onChange: (value: string) => void;
}

const NameInput = ({ name, onChange }: NameInputProps) => {
  // 使用本地状态跟踪输入值
  const [inputValue, setInputValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 仅在组件挂载和name属性初始化时设置一次初始值
  useEffect(() => {
    if (name && !inputValue) {
      setInputValue(name);
    }
  }, []);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="mb-4">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Name
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Edit size={16} className="text-gray-400" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          id="name"
          value={inputValue}
          onChange={handleChange}
          className="w-full pl-10 pr-4"
          placeholder="Bookmark name"
        />
      </div>
    </div>
  );
};

export default NameInput;
