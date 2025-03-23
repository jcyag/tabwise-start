import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";

interface SearchEngine {
  name: string;
  label: string;
  url: string;
  placeholder: string;
  isLLM?: boolean;
}

const searchEngines: SearchEngine[] = [
  {
    name: "google",
    label: "Google",
    url: "https://www.google.com/search?q=",
    placeholder: "Search Google..."
  },
  {
    name: "baidu",
    label: "百度",
    url: "https://www.baidu.com/s?wd=",
    placeholder: "百度一下..."
  },
  {
    name: "sougou",
    label: "搜狗",
    url: "https://www.sogou.com/web?query=",
    placeholder: "搜狗搜索..."
  },
  {
    name: "chatgpt",
    label: "ChatGPT",
    url: "https://chat.openai.com/",
    placeholder: "Ask ChatGPT...",
    isLLM: true
  },
  {
    name: "yuanbao",
    label: "腾讯元宝",
    url: "https://yuanbao.tencent.com/chat/naQivTmsDa",
    placeholder: "腾讯元宝搜索...",
    isLLM: true
  }
];

const SearchBar = () => {
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(searchEngines[0]);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (selectedEngine.isLLM) {
        handleLLMSearch(selectedEngine, query);
      } else {
        window.open(`${selectedEngine.url}${encodeURIComponent(query)}`, "_self");
      }
    }
  };

  const handleLLMSearch = (engine: SearchEngine, userQuery: string) => {
    if (engine.name === "chatgpt") {
      // Open ChatGPT with the query
      const chatGptUrl = `${engine.url}?q=${encodeURIComponent(userQuery)}`;
      window.open(chatGptUrl, "_blank");
    } else if (engine.name === "yuanbao") {
      // Open Tencent Yuanbao with the updated URL
      window.open(engine.url, "_blank");
      
      // Copy the query to clipboard for easier pasting
      navigator.clipboard.writeText(userQuery).catch(err => {
        console.error("Could not copy text to clipboard:", err);
      });
    }
  };

  const handleEngineChange = (engine: SearchEngine) => {
    setSelectedEngine(engine);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 mt-12 fade-in" style={{ position: 'relative', zIndex: 1001 }}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative flex items-center w-full">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span className="mr-1 font-medium hidden sm:inline whitespace-nowrap">{selectedEngine.label}</span>
              <ChevronDown size={18} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-36 rounded-md shadow-lg dropdown-menu animate-fade-in overflow-hidden" style={{ zIndex: 9999 }}>
                <div className="py-1">
                  {searchEngines.map((engine) => (
                    <button
                      key={engine.name}
                      type="button"
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors whitespace-nowrap ${
                        selectedEngine.name === engine.name ? 'bg-gray-50 font-medium' : ''
                      }`}
                      onClick={() => handleEngineChange(engine)}
                    >
                      {engine.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-14 pl-32 sm:pl-36 pr-14 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-shadow glass-morphism"
            placeholder={selectedEngine.placeholder}
          />
          
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
