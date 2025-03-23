
import { useEffect } from "react";
import DialogLayout from "./dialog/DialogLayout";
import UrlInput from "./bookmark/UrlInput";
import NameInput from "./bookmark/NameInput";
import DialogActions from "./dialog/DialogActions";
import { useBookmarkForm } from "../hooks/useBookmarkForm";

interface AddBookmarkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string, name: string) => void;
  groupId: string;
}

const AddBookmarkDialog = ({ isOpen, onClose, onAdd, groupId }: AddBookmarkDialogProps) => {
  const {
    url,
    name,
    isValid,
    urlInputRef,
    handleUrlChange,
    handleNameChange,
    resetForm
  } = useBookmarkForm();

  // Reset form and focus URL input when dialog opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
      
      // Focus the URL input after a short delay to ensure the dialog is fully rendered
      setTimeout(() => {
        if (urlInputRef.current) {
          urlInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, resetForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid) return;
    
    let finalUrl = url;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "http://" + finalUrl;
    }
    
    onAdd(finalUrl, name || new URL(finalUrl).hostname);
    
    resetForm();
    onClose();
  };

  return (
    <DialogLayout isOpen={isOpen} onClose={onClose} title="Add Bookmark">
      <form onSubmit={handleSubmit} className="p-4">
        <UrlInput 
          url={url} 
          onChange={handleUrlChange} 
          isValid={isValid} 
          inputRef={urlInputRef}
        />
        
        <NameInput 
          name={name} 
          onChange={handleNameChange} 
        />
        
        <DialogActions 
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Add Bookmark"
          isSubmitDisabled={!isValid}
        />
      </form>
    </DialogLayout>
  );
};

export default AddBookmarkDialog;
