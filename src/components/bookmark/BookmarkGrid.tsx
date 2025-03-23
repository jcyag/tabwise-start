
import { useDrop } from "react-dnd";
import BookmarkItem from "../BookmarkItem";
import { Bookmark } from "@/types";
import EmptyBookmarks from "./EmptyBookmarks";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  groupId: string;
  onDeleteBookmark: (id: string) => void;
  onEditBookmark: (id: string, newName: string) => void;
  onAddBookmark: (groupId: string) => void;
  onMoveBookmark: (dragIndex: number, hoverIndex: number, groupId: string) => void;
}

const BookmarkGrid = ({
  bookmarks,
  groupId,
  onDeleteBookmark,
  onEditBookmark,
  onAddBookmark,
  onMoveBookmark
}: BookmarkGridProps) => {
  const [, bookmarksDrop] = useDrop({
    accept: "BOOKMARK",
    hover: (item: any) => {
      if (item.type === "BOOKMARK" && item.groupId === groupId) {
        // Enable sorting functionality within the group
        // Actual sorting happens in individual BookmarkItem components
      }
    }
  });

  if (bookmarks.length === 0) {
    return <EmptyBookmarks onAddBookmark={() => onAddBookmark(groupId)} />;
  }

  return (
    <div className="animate-slide-in" ref={bookmarksDrop}>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
        {bookmarks.map((bookmark, bookmarkIndex) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={onDeleteBookmark}
            onEdit={onEditBookmark}
            index={bookmarkIndex}
            onMoveBookmark={onMoveBookmark}
          />
        ))}
      </div>
    </div>
  );
};

export default BookmarkGrid;
