
import { Bookmark, FolderPlus } from "lucide-react";

interface BookmarkHeaderProps {
  onAddGroup: () => void;
}

const BookmarkHeader = ({ onAddGroup }: BookmarkHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <Bookmark size={20} className="mr-2 text-gray-600" />
        <h2 className="text-lg font-medium text-gray-700">Bookmarks</h2>
      </div>
      <button
        onClick={onAddGroup}
        className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
      >
        <FolderPlus size={18} />
        <span className="text-sm">New Group</span>
      </button>
    </div>
  );
};

export default BookmarkHeader;
