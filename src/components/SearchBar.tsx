
import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { postMessageToIframes } from "@/utils/helpers";

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
    url: "https://yuanbao.tencent.com/chat/",
    placeholder: "腾讯元宝搜索...",
    isLLM: true
  }
];

const SearchBar = () => {
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(searchEngines[0]);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      // Generate a conversation ID using timestamp and random string
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 10);
      const conversationId = `${timestamp}${randomStr}`;
      
      // Create the yuanbao URL with the conversation ID
      const yuanbaoUrl = `${engine.url}${conversationId}`;
      
      // Function to directly send a message to Yuanbao
      const sendMessageToYuanbao = async (tab: Window | null, message: string) => {
        if (!tab) return;
        
        // Wait for the page to load
        setTimeout(() => {
          // Create a message event to send to the new window
          const messageEvent = {
            type: 'YUANBAO_AUTO_QUERY',
            query: message
          };
          
          // Send the message to the new window - fix type error
          tab.postMessage(messageEvent, '*');
          
          // Notify the user
          toast({
            title: "已发送到腾讯元宝",
            description: "您的问题已自动发送至元宝对话框。",
            duration: 5000,
          });
        }, 2000); // Wait 2 seconds for the page to load
      };
      
      // Open Yuanbao in a new tab
      const yuanbaoWindow = window.open(yuanbaoUrl, "_blank");
      
      // Send the message to Yuanbao
      sendMessageToYuanbao(yuanbaoWindow, userQuery);
      
      // Also copy the query to clipboard as a fallback
      navigator.clipboard.writeText(userQuery).catch(err => {
        console.error("Could not copy text to clipboard:", err);
        toast({
          title: "无法自动复制文本",
          description: "请手动复制您的搜索内容。",
          variant: "destructive",
        });
      });
      
      // Add a message listener to allow communication with the Yuanbao page
      window.addEventListener('message', function yuanbaoMessageHandler(event) {
        if (event.data && event.data.type === 'YUANBAO_READY') {
          const sourceWindow = event.source as Window;
          sourceWindow.postMessage({
            type: 'YUANBAO_QUERY',
            query: userQuery
          }, '*');
          
          // Clean up the event listener after use
          window.removeEventListener('message', yuanbaoMessageHandler);
        }
      });
      
      // Inject a script into the parent page to help with Yuanbao integration
      const yuanbaoScript = document.createElement('script');
      yuanbaoScript.id = 'yuanbao-integration';
      yuanbaoScript.textContent = `
        // This script will automatically try to click on the input field and add text when Yuanbao is loaded
        document.addEventListener('DOMContentLoaded', function() {
          // Notify the parent window that Yuanbao is ready
          window.opener && window.opener.postMessage({
            type: 'YUANBAO_READY'
          }, '*');
          
          // Listen for messages from the parent window
          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'YUANBAO_QUERY' || event.data.type === 'YUANBAO_AUTO_QUERY') {
              // Try to find the input field and button
              setTimeout(() => {
                const inputFields = document.querySelectorAll('textarea, input[type="text"]');
                const sendButtons = document.querySelectorAll('button');
                
                // Look for the chat input field
                let inputField = null;
                for (const field of inputFields) {
                  if (field.placeholder && (field.placeholder.includes('输入') || 
                      field.placeholder.includes('问题') || 
                      field.placeholder.includes('聊天'))) {
                    inputField = field;
                    break;
                  }
                }
                
                // If we found an input field, set its value and try to submit
                if (inputField) {
                  inputField.value = event.data.query;
                  inputField.dispatchEvent(new Event('input', { bubbles: true }));
                  
                  // Try to find and click the send button
                  let sendButton = null;
                  for (const button of sendButtons) {
                    if (button.textContent && (button.textContent.includes('发送') || 
                        button.textContent.includes('提问') || 
                        button.textContent.includes('确认'))) {
                      sendButton = button;
                      break;
                    }
                  }
                  
                  if (sendButton) {
                    setTimeout(() => {
                      sendButton.click();
                    }, 300);
                  }
                }
              }, 1500);
            }
          });
        });
      `;
      
      // Append the script to help with Yuanbao integration
      document.body.appendChild(yuanbaoScript);
      
      // Clean up after a delay
      setTimeout(() => {
        const script = document.getElementById('yuanbao-integration');
        if (script) script.remove();
      }, 30000); // Remove after 30 seconds
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
