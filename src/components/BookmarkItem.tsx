
import { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Bookmark } from "../types";
import BookmarkActions from "./bookmark/BookmarkActions";
import BookmarkFavicon from "./bookmark/BookmarkFavicon";
import BookmarkTitle from "./bookmark/BookmarkTitle";
import DraggableBookmark from "./bookmark/DraggableBookmark";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  index: number;
  onMoveBookmark?: (dragIndex: number, hoverIndex: number, groupId: string) => void;
  isEditMode?: boolean;
}

// Define the DragItem interface for type safety
interface DragItem {
  index: number;
  id: string;
  groupId: string;
  type: string;
}

const BookmarkItem = ({ 
  bookmark, 
  onDelete, 
  onEdit, 
  index, 
  onMoveBookmark,
  isEditMode = false 
}: BookmarkItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
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
      if (!clientOffset) return;

      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // When dragging right to left (dragIndex > hoverIndex)
      // We only move when mouse is left of the middle
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // When dragging left to right (dragIndex < hoverIndex)
      // We only move when mouse is right of the middle  
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
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

  const handleEditAction = () => {
    setIsEditing(true);
  };

  const handleTitleEdit = (newName: string) => {
    onEdit(bookmark.id, newName);
    setIsEditing(false);
  };

  const handleDeleteAction = () => {
    onDelete(bookmark.id);
  };

  const handleClick = () => {
    if (!isEditing) {
      window.open(bookmark.url, "_blank");
    }
  };

  const showActions = isEditMode || (isHovered && !isEditing);

  return (
    <div
      ref={ref}
      className={`animate-slide-in ${isDragging ? "opacity-50" : ""}`}
      data-handler-id={handlerId}
    >
      <div
        className={`w-full glass-morphism rounded-lg p-2 flex flex-col items-center justify-center space-y-1.5 hover:shadow-md transition-shadow bookmark-item cursor-pointer ${isEditMode ? 'ring-1 ring-blue-300' : ''}`}
        style={{ maxWidth: "120px", height: "auto", minHeight: "60px" }}
        onClick={!isEditMode ? handleClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BookmarkFavicon url={bookmark.url} />
        
        <BookmarkTitle 
          name={bookmark.name} 
          isEditing={isEditing} 
          onEdit={handleTitleEdit} 
        />
        
        {showActions && !isEditing && (
          <BookmarkActions
            onEdit={handleEditAction}
            onDelete={handleDeleteAction}
          />
        )}
      </div>
    </div>
  );
};

export default BookmarkItem;
