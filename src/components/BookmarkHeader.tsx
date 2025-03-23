
import { Bookmark } from "lucide-react";

const BookmarkHeader = () => {
  return (
    <div className="flex items-center mb-4">
      <div className="flex items-center">
        <Bookmark size={20} className="mr-2 text-gray-600" />
        <h2 className="text-lg font-medium text-gray-700">Bookmarks</h2>
      </div>
    </div>
  );
};

export default BookmarkHeader;
