
import { useState } from "react";

interface BookmarkTitleProps {
  name: string;
  isEditing: boolean;
  onEdit: (newName: string) => void;
}

const BookmarkTitle = ({ name, isEditing, onEdit }: BookmarkTitleProps) => {
  const [newName, setNewName] = useState(name);

  const handleEdit = () => {
    if (newName.trim() !== "") {
      onEdit(newName);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    }
  };

  if (isEditing) {
    return (
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
    );
  }

  return (
    <span className="text-xs text-gray-700 truncate w-full text-center">
      {name}
    </span>
  );
};

export default BookmarkTitle;
