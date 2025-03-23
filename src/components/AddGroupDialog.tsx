
import { useState, useEffect, useRef } from "react";
import { Folder } from "lucide-react";
import DialogLayout from "./dialog/DialogLayout";
import DialogActions from "./dialog/DialogActions";

interface AddGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const AddGroupDialog = ({ isOpen, onClose, onAdd }: AddGroupDialogProps) => {
  const [name, setName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
    
    if (isOpen) {
      setName("");
    }
  }, [isOpen]);

  useEffect(() => {
    setIsValid(name.trim().length > 0);
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    onAdd(name.trim());
    
    // Reset form
    setName("");
    onClose();
  };

  return (
    <DialogLayout isOpen={isOpen} onClose={onClose} title="Create New Group">
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
        
        <DialogActions 
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Create Group"
          isSubmitDisabled={!isValid}
        />
      </form>
    </DialogLayout>
  );
};

export default AddGroupDialog;
