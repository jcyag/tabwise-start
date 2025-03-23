
import { useState } from "react";
import { Bookmark, BookmarkGroup as BookmarkGroupType } from "../types";
import GroupHeader from "./bookmark/GroupHeader";
import BookmarkGrid from "./bookmark/BookmarkGrid";
import GroupDragContainer from "./bookmark/GroupDragContainer";

interface BookmarkGroupProps {
  group: BookmarkGroupType;
  bookmarks: Bookmark[];
  onAddBookmark: (groupId: string) => void;
  onDeleteBookmark: (id: string) => void;
  onEditBookmark: (id: string, newName: string) => void;
  onDeleteGroup: (id: string) => void;
  onEditGroup: (id: string, newName: string) => void;
  onDropBookmark: (bookmarkId: string, targetGroupId: string) => void;
  index: number;
  onMoveGroup: (dragIndex: number, hoverIndex: number) => void;
  onMoveBookmark: (dragIndex: number, hoverIndex: number, groupId: string) => void;
}

const BookmarkGroup = ({
  group,
  bookmarks,
  onAddBookmark,
  onDeleteBookmark,
  onEditBookmark,
  onDeleteGroup,
  onEditGroup,
  onDropBookmark,
  index,
  onMoveGroup,
  onMoveBookmark,
}: BookmarkGroupProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const filteredBookmarks = bookmarks.filter(
    (bookmark) => bookmark.groupId === group.id
  );

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <GroupDragContainer 
      groupId={group.id}
      index={index}
      onMoveGroup={onMoveGroup}
      onDropBookmark={onDropBookmark}
    >
      <GroupHeader
        group={group}
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
        onEditGroup={onEditGroup}
        onDeleteGroup={onDeleteGroup}
        onAddBookmark={onAddBookmark}
      />
      
      {isExpanded && (
        <BookmarkGrid
          bookmarks={filteredBookmarks}
          groupId={group.id}
          onDeleteBookmark={onDeleteBookmark}
          onEditBookmark={onEditBookmark}
          onAddBookmark={onAddBookmark}
          onMoveBookmark={onMoveBookmark}
        />
      )}
    </GroupDragContainer>
  );
};

export default BookmarkGroup;
