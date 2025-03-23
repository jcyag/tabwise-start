
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

  // 当对话框打开时重置表单并聚焦URL输入框
  useEffect(() => {
    if (isOpen) {
      resetForm();
      
      // 短暂延迟后聚焦URL输入，确保对话框完全渲染
      setTimeout(() => {
        if (urlInputRef.current) {
          urlInputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalUrl = url;
    if (!/^https?:\/\//i.test(finalUrl) && finalUrl.trim() !== "") {
      finalUrl = "http://" + finalUrl;
    }
    
    // 使用URL或如果可能的话提取主机名
    let displayName = name;
    if (!displayName) {
      try {
        displayName = new URL(finalUrl).hostname;
      } catch (e) {
        displayName = finalUrl; // 如果解析失败，使用URL作为名称
      }
    }
    
    onAdd(finalUrl, displayName);
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
          isSubmitDisabled={false}
        />
      </form>
    </DialogLayout>
  );
};

export default AddBookmarkDialog;
