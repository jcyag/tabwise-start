
import { Bookmark } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { FolderPlus, Pencil } from "lucide-react";

interface BookmarkHeaderProps {
  onAddGroup: () => void;
  toggleEditMode: () => void;
  isEditMode: boolean;
}

const BookmarkHeader = ({ onAddGroup, toggleEditMode, isEditMode }: BookmarkHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 w-full">
      <HoverCard openDelay={0} closeDelay={200}>
        <HoverCardTrigger asChild>
          <div className="flex items-center cursor-pointer">
            <Bookmark size={20} className="mr-2 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-700">Bookmarks</h2>
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="right" align="start" className="p-2 flex space-x-2 border-0 shadow-md">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAddGroup}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <FolderPlus size={16} className="mr-1" />
            <span className="text-sm">New Group</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleEditMode}
            className={isEditMode ? "bg-blue-100" : ""}
          >
            <Pencil size={16} className="mr-1" />
            {isEditMode ? "Exit Edit Mode" : "Edit Mode"}
          </Button>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default BookmarkHeader;
