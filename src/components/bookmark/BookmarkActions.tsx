
import { Edit, Trash2 } from "lucide-react";

interface BookmarkActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const BookmarkActions = ({ onEdit, onDelete }: BookmarkActionsProps) => {
  return (
    <div className="flex justify-center space-x-1 mt-1">
      <div
        className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full transition-colors"
        onClick={onEdit}
      >
        <Edit size={12} />
      </div>
      <div
        className="text-gray-400 hover:text-red-500 p-0.5 rounded-full transition-colors"
        onClick={onDelete}
      >
        <Trash2 size={12} />
      </div>
    </div>
  );
};

export default BookmarkActions;
