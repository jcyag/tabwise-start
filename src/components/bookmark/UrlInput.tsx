
import { Link } from "lucide-react";
import { Input } from "../ui/input";

interface UrlInputProps {
  url: string;
  onChange: (value: string) => void;
  isValid: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const UrlInput = ({ url, onChange, isValid, inputRef }: UrlInputProps) => {
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
          value={url}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 py-2 px-4 border ${
            url && !isValid
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-300 focus:ring-blue-200"
          } rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
          placeholder="https://example.com"
          autoComplete="off"
        />
      </div>
      {url && !isValid && (
        <p className="mt-1 text-sm text-red-500">Please enter a valid URL</p>
      )}
    </div>
  );
};

export default UrlInput;
