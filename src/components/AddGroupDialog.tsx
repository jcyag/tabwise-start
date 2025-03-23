
import { useState, useEffect, useRef } from "react";
import { X, Folder } from "lucide-react";

interface AddGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddGroupDialog = ({ isOpen, onClose, onAdd }: AddGroupDialogProps) => {
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
    
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setIsValid(name.trim().length > 0);
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    onAdd(name.trim());
    
    // Reset form
    setName("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div 
        ref={dialogRef}
        className="modal-content bg-white rounded-lg shadow-lg overflow-hidden animate-fade-in"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Create New Group</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Folder size={16} className="text-gray-400" />
              </div>
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                placeholder="Enter group name"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
                isValid
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGroupDialog;
