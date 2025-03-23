
import { useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import RecentHistory from "@/components/RecentHistory";
import BookmarkSection from "@/components/BookmarkSection";

const Index = () => {
  // Apply smooth scrolling behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-3/4 h-1/2 bg-gradient-to-tl from-gray-50 to-blue-50 opacity-40 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-yellow-100 opacity-20 rounded-full blur-2xl"></div>
        <div className="absolute top-2/3 right-1/3 w-48 h-48 bg-blue-100 opacity-20 rounded-full blur-2xl"></div>
      </div>
      
      <div className="container max-w-3xl mx-auto px-4 pt-4">
        <div className="relative">
          {/* Search bar */}
          <div style={{ position: 'relative', zIndex: 100 }}>
            <SearchBar />
          </div>
          
          {/* Recent history - adjusted spacing */}
          <div style={{ position: 'relative', zIndex: 10 }}>
            <RecentHistory />
          </div>
          
          {/* Bookmark section */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <BookmarkSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
