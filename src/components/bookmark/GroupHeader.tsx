
import { useState, useRef } from "react";
import { FolderOpen, FolderClosed, Edit2, Trash2, Plus } from "lucide-react";
import { BookmarkGroup } from "@/types";

interface GroupHeaderProps {
  group: BookmarkGroup;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEditGroup: (id: string, newName: string) => void;
  onDeleteGroup: (id: string) => void;
  onAddBookmark: (groupId: string) => void;
}

const GroupHeader = ({
  group,
  isExpanded,
  onToggleExpand,
  onEditGroup,
  onDeleteGroup,
  onAddBookmark,
}: GroupHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(group.name);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      className="flex items-center mb-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={onToggleExpand}
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
          onClick={onToggleExpand}
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
  );
};

export default GroupHeader;
