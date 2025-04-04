
import * as React from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FolderPlus, Pencil } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookmarkHeaderProps {
  onAddGroup: () => void;
  toggleEditMode: () => void;
  isEditMode: boolean;
}

const BookmarkHeader = ({ onAddGroup, toggleEditMode, isEditMode }: BookmarkHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between mb-4 w-full hover-trigger group">
      <div className="flex items-center">
        <Bookmark size={20} className="mr-2 text-gray-600" />
        <h2 className="text-lg font-medium text-gray-700">Bookmarks</h2>
      </div>
      
      <div className={`flex items-center space-x-2 transition-opacity duration-200 ${isMobile ? "" : "opacity-0 group-hover:opacity-100"}`}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onAddGroup}
          className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
        >
          <FolderPlus size={16} className="mr-1" />
          <span className="text-sm">New Group</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleEditMode}
          className={`hover:bg-blue-50 rounded-lg ${isEditMode ? "bg-blue-100" : ""}`}
        >
          <Pencil size={16} className="mr-1" />
          {isEditMode ? "Exit Edit Mode" : "Edit Mode"}
        </Button>
      </div>
    </div>
  );
};

export default BookmarkHeader;
