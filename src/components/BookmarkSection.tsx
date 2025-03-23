
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BookmarkGroup from "./BookmarkGroup";
import AddBookmarkDialog from "./AddBookmarkDialog";
import AddGroupDialog from "./AddGroupDialog";
import BookmarkHeader from "./BookmarkHeader";
import { useBookmarks } from "../hooks/useBookmarks";

const BookmarkSection = () => {
  const {
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
  } = useBookmarks();

  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);

  // Handler to open add bookmark dialog
  const openAddBookmarkDialog = (groupId: string) => {
    const shouldOpen = handleAddBookmark(groupId);
    if (shouldOpen) {
      setIsAddingBookmark(true);
    }
  };

  // Handler to open add group dialog
  const openAddGroupDialog = () => {
    setIsAddingGroup(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-3xl mx-auto fade-in">
        <BookmarkHeader onAddGroup={openAddGroupDialog} />

        {groups.map((group, index) => (
          <BookmarkGroup
            key={group.id}
            group={group}
            bookmarks={bookmarks}
            onAddBookmark={openAddBookmarkDialog}
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
