
import { Edit, Trash2 } from "lucide-react";

interface BookmarkActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const BookmarkActions = ({ onEdit, onDelete }: BookmarkActionsProps) => {
  return (
    <div className="flex justify-center space-x-2 mt-1">
      <button
        className="text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        aria-label="Edit bookmark"
      >
        <Edit size={14} />
      </button>
      <button
        className="text-gray-400 hover:text-red-500 p-1 rounded-full transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        aria-label="Delete bookmark"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default BookmarkActions;
