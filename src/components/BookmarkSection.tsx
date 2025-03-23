
import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Bookmark, FolderPlus } from "lucide-react";
import BookmarkGroup from "./BookmarkGroup";
import AddBookmarkDialog from "./AddBookmarkDialog";
import AddGroupDialog from "./AddGroupDialog";
import { Bookmark as BookmarkType, BookmarkGroup as BookmarkGroupType } from "../types";
import { generateId } from "../utils/helpers";
import { toast } from "sonner";

const BookmarkSection = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [groups, setGroups] = useState<BookmarkGroupType[]>([]);
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    const loadedBookmarks = localStorage.getItem("bookmarks");
    const loadedGroups = localStorage.getItem("bookmarkGroups");

    if (!loadedGroups) {
      const defaultGroups: BookmarkGroupType[] = [
        { id: "default", name: "General" },
        { id: "work", name: "Work" },
        { id: "personal", name: "Personal" }
      ];
      setGroups(defaultGroups);
      localStorage.setItem("bookmarkGroups", JSON.stringify(defaultGroups));
    } else {
      setGroups(JSON.parse(loadedGroups));
    }

    if (loadedBookmarks) {
      setBookmarks(JSON.parse(loadedBookmarks));
    }
  }, []);

  useEffect(() => {
    if (bookmarks.length > 0) {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem("bookmarkGroups", JSON.stringify(groups));
    }
  }, [groups]);

  const handleAddBookmark = (groupId: string) => {
    setSelectedGroupId(groupId);
    setIsAddingBookmark(true);
  };

  const handleCreateBookmark = (url: string, name: string) => {
    if (!selectedGroupId) return;
    
    const newBookmark: BookmarkType = {
      id: generateId(),
      url,
      name,
      groupId: selectedGroupId,
      createdAt: new Date().toISOString()
    };

    setBookmarks([...bookmarks, newBookmark]);
    setIsAddingBookmark(false);
    toast.success(`Added bookmark: ${name}`);
  };

  const handleAddGroup = () => {
    setIsAddingGroup(true);
  };

  const handleCreateGroup = (name: string) => {
    const newGroup: BookmarkGroupType = {
      id: generateId(),
      name
    };

    setGroups([...groups, newGroup]);
    setIsAddingGroup(false);
    toast.success(`Added group: ${name}`);
  };

  const handleDeleteBookmark = (id: string) => {
    const bookmarkToDelete = bookmarks.find(bookmark => bookmark.id === id);
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    if (bookmarkToDelete) {
      toast.success(`Deleted bookmark: ${bookmarkToDelete.name}`);
    }
  };

  const handleEditBookmark = (id: string, newName: string) => {
    setBookmarks(
      bookmarks.map(bookmark => 
        bookmark.id === id ? { ...bookmark, name: newName } : bookmark
      )
    );
  };

  const handleDeleteGroup = (id: string) => {
    const groupToDelete = groups.find(group => group.id === id);
    setGroups(groups.filter(group => group.id !== id));
    setBookmarks(bookmarks.filter(bookmark => bookmark.groupId !== id));
    if (groupToDelete) {
      toast.success(`Deleted group: ${groupToDelete.name}`);
    }
  };

  const handleEditGroup = (id: string, newName: string) => {
    setGroups(
      groups.map(group => 
        group.id === id ? { ...group, name: newName } : group
      )
    );
  };

  const handleDropBookmark = (bookmarkId: string, targetGroupId: string) => {
    setBookmarks(
      bookmarks.map(bookmark => 
        bookmark.id === bookmarkId 
          ? { ...bookmark, groupId: targetGroupId } 
          : bookmark
      )
    );
  };

  const handleMoveGroup = (dragIndex: number, hoverIndex: number) => {
    const newGroups = [...groups];
    const draggedGroup = newGroups.splice(dragIndex, 1)[0];
    newGroups.splice(hoverIndex, 0, draggedGroup);
    setGroups(newGroups);
    localStorage.setItem("bookmarkGroups", JSON.stringify(newGroups));
  };

  // Function to handle bookmark reordering within a group
  const handleMoveBookmark = (dragIndex: number, hoverIndex: number, groupId: string) => {
    // Get all bookmarks for this group
    const groupBookmarks = bookmarks
      .filter(bookmark => bookmark.groupId === groupId);
    
    // If there are less than 2 bookmarks, no need to reorder
    if (groupBookmarks.length < 2) return;
    
    // Create a new array of bookmarks with the updated order
    const newBookmarks = [...bookmarks];
    
    // Find the actual indices in the main bookmarks array
    const allGroupIndices = bookmarks
      .map((bookmark, index) => bookmark.groupId === groupId ? index : -1)
      .filter(index => index !== -1);
    
    if (dragIndex >= allGroupIndices.length || hoverIndex >= allGroupIndices.length) {
      return; // Invalid indices
    }
    
    // Get the actual bookmark objects
    const dragBookmark = bookmarks[allGroupIndices[dragIndex]];
    
    // Remove the dragged bookmark from array
    const updatedBookmarks = newBookmarks.filter(b => b.id !== dragBookmark.id);
    
    // Calculate the insert position
    let insertAt;
    if (hoverIndex === 0) {
      // Insert at the beginning of the group
      insertAt = allGroupIndices[0];
    } else if (hoverIndex >= allGroupIndices.length) {
      // Insert at the end
      insertAt = bookmarks.length;
    } else {
      // Insert at the correct position
      insertAt = allGroupIndices[hoverIndex];
      // Adjust for removal of dragged item
      if (dragIndex < hoverIndex) {
        insertAt--;
      }
    }
    
    // Insert the bookmark at the new position
    updatedBookmarks.splice(insertAt, 0, dragBookmark);
    
    // Update state and localStorage
    setBookmarks(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-3xl mx-auto fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bookmark size={20} className="mr-2 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-700">Bookmarks</h2>
          </div>
          <button
            onClick={handleAddGroup}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <FolderPlus size={18} />
            <span className="text-sm">New Group</span>
          </button>
        </div>

        {groups.map((group, index) => (
          <BookmarkGroup
            key={group.id}
            group={group}
            bookmarks={bookmarks}
            onAddBookmark={handleAddBookmark}
            onDeleteBookmark={handleDeleteBookmark}
            onEditBookmark={handleEditBookmark}
            onDeleteGroup={handleDeleteGroup}
            onEditGroup={handleEditGroup}
            onDropBookmark={handleDropBookmark}
            index={index}
            onMoveGroup={handleMoveGroup}
            onMoveBookmark={handleMoveBookmark}
          />
        ))}

        <AddBookmarkDialog
          isOpen={isAddingBookmark}
          onClose={() => setIsAddingBookmark(false)}
          onAdd={handleCreateBookmark}
          groupId={selectedGroupId || ""}
        />

        <AddGroupDialog
          isOpen={isAddingGroup}
          onClose={() => setIsAddingGroup(false)}
          onAdd={handleCreateGroup}
        />
      </div>
    </DndProvider>
  );
};

export default BookmarkSection;
