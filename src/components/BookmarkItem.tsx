
import { useState } from "react";
import { Trash2, Edit } from "lucide-react";
import { useDrag } from "react-dnd";
import { Bookmark } from "../types";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
}

const BookmarkItem = ({ bookmark, onDelete, onEdit }: BookmarkItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(bookmark.name);
  const [isHovered, setIsHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "BOOKMARK",
    item: { id: bookmark.id, groupId: bookmark.groupId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleEdit = () => {
    if (newName.trim() !== "") {
      onEdit(bookmark.id, newName);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    }
  };

  const handleClick = () => {
    if (!isEditing) {
      window.open(bookmark.url, "_blank");
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    }
  };

  return (
    <div
      ref={drag}
      className={`glass-morphism rounded-lg p-2 transition-all bookmark-item ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        maxWidth: "120px", // Slightly reduced max-width for vertical layout
        width: "auto"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex flex-col items-center relative"
        onClick={handleClick}
      >
        <div className="mb-1.5 flex-shrink-0">
          <img
            src={getFaviconUrl(bookmark.url)}
            alt=""
            className="w-6 h-6 rounded-sm object-contain"
            onError={(e) => {
              // Fallback if favicon doesn't load
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/64?text=🔖";
            }}
          />
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={handleKeyDown}
            className="w-full text-xs rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-300"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="text-xs text-gray-700 text-center truncate w-full">
            {bookmark.name}
          </span>
        )}

        {isHovered && !isEditing && (
          <div className="flex space-x-0.5 mt-1 absolute -bottom-6 bg-white/80 rounded-full">
            <button
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Edit size={12} />
            </button>
            <button
              className="text-gray-400 hover:text-red-500 p-0.5 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(bookmark.id);
              }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkItem;
