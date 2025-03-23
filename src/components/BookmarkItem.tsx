
import { useState, useRef } from "react";
import { Trash2, Edit } from "lucide-react";
import { useDrag, useDrop } from "react-dnd";
import { Bookmark } from "../types";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  index: number;
  onMoveBookmark?: (dragIndex: number, hoverIndex: number, groupId: string) => void;
}

// Define the DragItem interface for type safety
interface DragItem {
  index: number;
  id: string;
  groupId: string;
  type: string;
}

const BookmarkItem = ({ bookmark, onDelete, onEdit, index, onMoveBookmark }: BookmarkItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(bookmark.name);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "BOOKMARK",
    item: { 
      id: bookmark.id, 
      groupId: bookmark.groupId, 
      type: "BOOKMARK", 
      index 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: "BOOKMARK",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      
      // Only handle items within the same group
      if (item.groupId !== bookmark.groupId) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get horizontal middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the left
      const hoverClientX = clientOffset!.x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items width
      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging left
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      if (onMoveBookmark) {
        onMoveBookmark(dragIndex, hoverIndex, bookmark.groupId);
      }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  // Connect the drag and drop refs
  drag(drop(ref));

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
      ref={ref}
      className={`animate-slide-in ${isDragging ? "opacity-50" : ""}`}
      data-handler-id={handlerId}
    >
      <div
        className="w-full glass-morphism rounded-lg p-2 flex flex-col items-center justify-center space-y-1.5 hover:shadow-md transition-shadow bookmark-item cursor-pointer"
        style={{ maxWidth: "120px", height: "auto", minHeight: "60px" }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex-shrink-0">
          <img
            src={getFaviconUrl(bookmark.url)}
            alt=""
            className="w-5 h-5 rounded-sm object-contain"
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
          <span className="text-xs text-gray-700 truncate w-full text-center">
            {bookmark.name}
          </span>
        )}
        
        {isHovered && !isEditing && (
          <div className="flex justify-center space-x-1 mt-1">
            <div
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <Edit size={12} />
            </div>
            <div
              className="text-gray-400 hover:text-red-500 p-0.5 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(bookmark.id);
              }}
            >
              <Trash2 size={12} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkItem;
