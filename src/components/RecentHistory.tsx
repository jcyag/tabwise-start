
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getFaviconUrl, isChromeHistoryAvailable } from "@/utils/helpers";

interface HistoryItem {
  id: string;
  url: string;
  title: string;
  favicon: string;
  lastVisitTime: number;
}

const RecentHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Check if Chrome history API is available
        if (isChromeHistoryAvailable()) {
          console.log("Chrome history API available, fetching real data");
          // We're in a Chrome extension with history permission, use the actual API
          chrome.history.search(
            { text: '', maxResults: 6, startTime: 0 },
            (historyItems) => {
              const processedItems: HistoryItem[] = historyItems.map((item) => ({
                id: item.id || String(Math.random()),
                url: item.url || "",
                title: item.title || "Unknown",
                favicon: getFaviconUrl(item.url || ""),
                lastVisitTime: item.lastVisitTime || Date.now(),
              }));
              
              setHistory(processedItems);
              setLoading(false);
            }
          );
        } else {
          // We're in a regular web environment, use mock data
          console.log("Chrome history API not available, using mock data");
          
          // Mock history data for development/preview
          const mockHistory: HistoryItem[] = [
            {
              id: "1",
              url: "https://google.com",
              title: "Google",
              favicon: "https://www.google.com/favicon.ico",
              lastVisitTime: Date.now() - 1000 * 60 * 5
            },
            {
              id: "2",
              url: "https://github.com",
              title: "GitHub",
              favicon: "https://github.com/favicon.ico",
              lastVisitTime: Date.now() - 1000 * 60 * 10
            },
            {
              id: "3",
              url: "https://youtube.com",
              title: "YouTube",
              favicon: "https://www.youtube.com/favicon.ico",
              lastVisitTime: Date.now() - 1000 * 60 * 15
            },
            {
              id: "4",
              url: "https://netflix.com",
              title: "Netflix",
              favicon: "https://www.netflix.com/favicon.ico",
              lastVisitTime: Date.now() - 1000 * 60 * 30
            },
            {
              id: "5",
              url: "https://twitter.com",
              title: "Twitter",
              favicon: "https://twitter.com/favicon.ico",
              lastVisitTime: Date.now() - 1000 * 60 * 45
            },
            {
              id: "6",
              url: "https://facebook.com",
              title: "Facebook",
              favicon: "https://www.facebook.com/favicon.ico",
              lastVisitTime: Date.now() - 1000 * 60 * 60
            }
          ];
          
          setTimeout(() => {
            setHistory(mockHistory);
            setLoading(false);
          }, 300); // Simulating network delay
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        toast({
          title: "Error",
          description: "Failed to load browsing history",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchHistory();
  }, [toast]);

  const navigateTo = (url: string) => {
    window.open(url, "_self");
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-6 fade-in">
        <div className="flex items-center mb-3">
          <Clock size={18} className="mr-2 text-gray-500" />
          <h2 className="text-base font-medium text-gray-600">Recent History</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="glass-morphism rounded-lg p-3 flex flex-col items-center justify-center space-y-2 h-20">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="w-full h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 fade-in">
      <div className="flex items-center mb-3">
        <Clock size={18} className="mr-2 text-gray-500" />
        <h2 className="text-base font-medium text-gray-600">Recent History</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {history.map((item, index) => (
          <div 
            key={item.id}
            className="animate-slide-in" 
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <button
              onClick={() => navigateTo(item.url)}
              className="w-full glass-morphism rounded-lg p-3 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-shadow bookmark-item"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={item.favicon}
                  alt=""
                  className="w-6 h-6 rounded-sm object-contain"
                  onError={(e) => {
                    // If favicon fails to load, replace with a default icon
                    (e.target as HTMLImageElement).src = "https://www.google.com/s2/favicons?domain=" + item.url;
                  }}
                />
              </div>
              <span className="text-xs text-gray-700 truncate w-full text-center">
                {item.title}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentHistory;
