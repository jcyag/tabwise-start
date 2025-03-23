import { useState, useEffect } from "react";
import { Bookmark, BookmarkGroup } from "../types";
import { generateId } from "../utils/helpers";
import { toast } from "sonner";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [groups, setGroups] = useState<BookmarkGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

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
    return true;
  };

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

  const handleCreateGroup = (name: string) => {
    const newGroup: BookmarkGroup = {
      id: generateId(),
      name
    };

    setGroups([...groups, newGroup]);
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

  const handleMoveBookmark = (dragIndex: number, hoverIndex: number, groupId: string) => {
    const groupBookmarks = bookmarks
      .filter(bookmark => bookmark.groupId === groupId);
    
    if (groupBookmarks.length < 2) return;
    
    const dragBookmark = groupBookmarks[dragIndex];
    if (!dragBookmark) return;
    
    const updatedBookmarks = [...bookmarks];
    
    const bookmarksInGroup = updatedBookmarks.filter(b => b.groupId === groupId);
    
    const remainingBookmarks = bookmarksInGroup.filter(b => b.id !== dragBookmark.id);
    
    remainingBookmarks.splice(hoverIndex, 0, dragBookmark);
    
    const finalBookmarks = updatedBookmarks
      .filter(b => b.groupId !== groupId)
      .concat(remainingBookmarks);
    
    setBookmarks(finalBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(finalBookmarks));
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
