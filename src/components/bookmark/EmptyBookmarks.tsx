
import { Plus } from "lucide-react";

interface EmptyBookmarksProps {
  onAddBookmark: () => void;
}

const EmptyBookmarks = ({ onAddBookmark }: EmptyBookmarksProps) => {
  return (
    <div className="text-center py-6 text-sm text-gray-500">
      No bookmarks in this group yet.
      <button
        className="block mx-auto mt-2 text-blue-500 hover:text-blue-600 transition-colors"
        onClick={onAddBookmark}
      >
        <span className="flex items-center justify-center">
          <Plus size={14} className="mr-1" /> Add a bookmark
        </span>
      </button>
    </div>
  );
};

export default EmptyBookmarks;
