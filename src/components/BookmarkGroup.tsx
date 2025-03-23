
import { useState, useRef } from "react";
import { FolderOpen, FolderClosed, Plus, Edit2, Trash2 } from "lucide-react";
import { useDrop } from "react-dnd";
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
}: BookmarkGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(group.name);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: "BOOKMARK",
    drop: (item: { id: string }) => {
      onDropBookmark(item.id, group.id);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

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

  return (
    <div 
      ref={drop} 
      className={cn(
        "mb-6 glass-morphism p-4 rounded-lg transition-all transform group-fade",
        isOver && "ring-2 ring-blue-300 bg-slate-50/80"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mr-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isExpanded ? <FolderOpen size={20} /> : <FolderClosed size={20} />}
          </button>
          
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
            <h3 
              className="text-base font-medium text-gray-700 cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {group.name}
            </h3>
          )}
        </div>
        
        <div className={`flex space-x-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
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
        <div className="animate-slide-in">
          {filteredBookmarks.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkItem
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={onDeleteBookmark}
                  onEdit={onEditBookmark}
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
