
import { useState, useEffect } from "react";
import { Bookmark, BookmarkGroup } from "../types";
import { generateId } from "../utils/helpers";
import { toast } from "sonner";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedBookmarks = localStorage.getItem("bookmarks");
    const loadedGroups = localStorage.getItem("bookmarkGroups");

    if (!loadedGroups) {
      const defaultGroups: BookmarkGroup[] = [
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

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    if (bookmarks.length > 0) {
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  // Save groups to localStorage when they change
  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem("bookmarkGroups", JSON.stringify(groups));
    }
  }, [groups]);

  // Handle adding a bookmark
  const handleAddBookmark = (groupId: string) => {
    setSelectedGroupId(groupId);
    return true; // Return true to indicate dialog should open
  };

  // Handle creating a bookmark
  const handleCreateBookmark = (url: string, name: string) => {
    if (!selectedGroupId) return;
    
    const newBookmark: Bookmark = {
      id: generateId(),
      url,
      name,
      groupId: selectedGroupId,
      createdAt: new Date().toISOString()
    };

    setBookmarks([...bookmarks, newBookmark]);
    toast.success(`Added bookmark: ${name}`);
  };

  // Handle creating a group
  const handleCreateGroup = (name: string) => {
    const newGroup: BookmarkGroup = {
      id: generateId(),
      name
    };

    setGroups([...groups, newGroup]);
    toast.success(`Added group: ${name}`);
  };

  // Handle deleting a bookmark
  const handleDeleteBookmark = (id: string) => {
    const bookmarkToDelete = bookmarks.find(bookmark => bookmark.id === id);
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
    if (bookmarkToDelete) {
      toast.success(`Deleted bookmark: ${bookmarkToDelete.name}`);
    }
  };

  // Handle editing a bookmark
  const handleEditBookmark = (id: string, newName: string) => {
    setBookmarks(
      bookmarks.map(bookmark => 
        bookmark.id === id ? { ...bookmark, name: newName } : bookmark
      )
    );
  };

  // Handle deleting a group
  const handleDeleteGroup = (id: string) => {
    const groupToDelete = groups.find(group => group.id === id);
    setGroups(groups.filter(group => group.id !== id));
    setBookmarks(bookmarks.filter(bookmark => bookmark.groupId !== id));
    if (groupToDelete) {
      toast.success(`Deleted group: ${groupToDelete.name}`);
    }
  };

  // Handle editing a group
  const handleEditGroup = (id: string, newName: string) => {
    setGroups(
      groups.map(group => 
        group.id === id ? { ...group, name: newName } : group
      )
    );
  };

  // Handle dropping a bookmark into a group
  const handleDropBookmark = (bookmarkId: string, targetGroupId: string) => {
    setBookmarks(
      bookmarks.map(bookmark => 
        bookmark.id === bookmarkId 
          ? { ...bookmark, groupId: targetGroupId } 
          : bookmark
      )
    );
  };

  // Handle moving a group
  const handleMoveGroup = (dragIndex: number, hoverIndex: number) => {
    const newGroups = [...groups];
    const draggedGroup = newGroups.splice(dragIndex, 1)[0];
    newGroups.splice(hoverIndex, 0, draggedGroup);
    setGroups(newGroups);
    localStorage.setItem("bookmarkGroups", JSON.stringify(newGroups));
  };

  // Handle moving a bookmark within a group
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

  return {
    bookmarks,
    groups,
    selectedGroupId,
    setSelectedGroupId,
    handleAddBookmark,
    handleCreateBookmark,
    handleCreateGroup,
    handleDeleteBookmark,
    handleEditBookmark,
    handleDeleteGroup,
    handleEditGroup,
    handleDropBookmark,
    handleMoveGroup,
    handleMoveBookmark
  };
}
