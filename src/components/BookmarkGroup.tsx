
import { useState, useRef } from "react";
import { FolderOpen, FolderClosed, Plus, Edit2, Trash2 } from "lucide-react";
import { useDrop, useDrag } from "react-dnd";
import BookmarkItem from "./BookmarkItem";
import { Bookmark, BookmarkGroup as BookmarkGroupType } from "../types";
import { cn } from "@/lib/utils";

interface BookmarkGroupProps {
  group: BookmarkGroupType;
  bookmarks: Bookmark[];
  onAddBookmark: (groupId: string) => void;
  onDeleteBookmark: (id: string) => void;
  onEditBookmark: (id: string, newName: string) => void;
  onDeleteGroup: (id: string) => void;
  onEditGroup: (id: string, newName: string) => void;
  onDropBookmark: (bookmarkId: string, targetGroupId: string) => void;
  index: number;
  onMoveGroup: (dragIndex: number, hoverIndex: number) => void;
  onMoveBookmark: (dragIndex: number, hoverIndex: number, groupId: string) => void;
}

const BookmarkGroup = ({
  group,
  bookmarks,
  onAddBookmark,
  onDeleteBookmark,
  onEditBookmark,
  onDeleteGroup,
  onEditGroup,
  onDropBookmark,
  index,
  onMoveGroup,
  onMoveBookmark,
}: BookmarkGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(group.name);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  
  // Make the group draggable
  const [{ isDragging }, drag] = useDrag({
    type: "GROUP",
    item: { index, type: "GROUP", id: group.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Make the group a drop target for bookmarks and other groups
  const [{ isOver }, drop] = useDrop({
    accept: ["BOOKMARK", "GROUP"],
    drop: (item: any) => {
      if (item.type === "BOOKMARK" && item.groupId !== group.id) {
        onDropBookmark(item.id, group.id);
      }
      return undefined;
    },
    hover: (item: any, monitor) => {
      // Only handle group drops here
      if (item.type !== "GROUP") return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      
      // Get rectangle on screen
      if (!groupRef.current) return;
      const hoverBoundingRect = groupRef.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Get mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      onMoveGroup(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Connect drag and drop refs
  drag(drop(groupRef));

  const filteredBookmarks = bookmarks.filter(
    (bookmark) => bookmark.groupId === group.id
  );

  const handleSubmit = () => {
    if (newName.trim() !== "") {
      onEditGroup(group.id, newName);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setNewName(group.name);
    }
  };

  // Create a drop target for sorting bookmarks within this group
  const [, bookmarksDrop] = useDrop({
    accept: "BOOKMARK",
    hover: (item: any, monitor) => {
      if (item.type !== "BOOKMARK" || item.groupId !== group.id) return;
      
      // We don't need any hover behavior for cross-group drops,
      // that's handled by the main drop handler
    }
  });

  return (
    <div 
      ref={groupRef} 
      className={cn(
        "mb-6 w-full fade-in cursor-grab",
        isOver && "ring-2 ring-blue-300 bg-slate-50/80",
        isDragging && "opacity-50"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center mb-3">
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          {isExpanded ? <FolderOpen size={18} /> : <FolderClosed size={18} />}
        </div>
        
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleSubmit}
            onKeyDown={handleKeyDown}
            className="text-base font-medium p-1 rounded border focus:outline-none focus:ring-1 focus:ring-blue-300"
            autoFocus
          />
        ) : (
          <h2 
            className="text-base font-medium text-gray-600 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {group.name}
          </h2>
        )}
        
        <div className={`flex space-x-1 ml-auto transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
            onClick={() => onDeleteGroup(group.id)}
          >
            <Trash2 size={16} />
          </button>
          <button
            className="text-gray-400 hover:text-blue-500 p-1 rounded-full transition-colors ml-1"
            onClick={() => onAddBookmark(group.id)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="animate-slide-in" ref={bookmarksDrop}>
          {filteredBookmarks.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
              {filteredBookmarks.map((bookmark, bookmarkIndex) => (
                <BookmarkItem
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={onDeleteBookmark}
                  onEdit={onEditBookmark}
                  index={bookmarkIndex}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-gray-500">
              No bookmarks in this group yet.
              <button
                className="block mx-auto mt-2 text-blue-500 hover:text-blue-600 transition-colors"
                onClick={() => onAddBookmark(group.id)}
              >
                <span className="flex items-center justify-center">
                  <Plus size={14} className="mr-1" /> Add a bookmark
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookmarkGroup;
