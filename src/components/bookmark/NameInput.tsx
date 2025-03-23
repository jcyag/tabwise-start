
import { Edit } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";

interface NameInputProps {
  name: string;
  onChange: (value: string) => void;
}

const NameInput = ({ name, onChange }: NameInputProps) => {
  // Add local state to handle input value
  const [inputValue, setInputValue] = useState(name);

  // Update local state when prop changes
  useEffect(() => {
    setInputValue(name);
  }, [name]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          type="text"
          id="name"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full pl-10 pr-4 py-2"
          placeholder="Bookmark name"
        />
      </div>
    </div>
  );
};

export default NameInput;
