
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Bookmark } from "@/types";

// Define the DragItem interface for type safety
interface DragItem {
  index: number;
  id: string;
  groupId: string;
  type: string;
}

interface DraggableBookmarkProps {
  children: React.ReactNode;
  bookmark: Bookmark;
  index: number;
  onMoveBookmark?: (dragIndex: number, hoverIndex: number, groupId: string) => void;
  isDragging: boolean;
  handlerId: string | symbol | null;
}

const DraggableBookmark = ({ 
  children, 
  bookmark, 
  index, 
  onMoveBookmark,
  isDragging,
  handlerId
}: DraggableBookmarkProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`animate-slide-in ${isDragging ? "opacity-50" : ""}`}
      data-handler-id={handlerId}
    >
      <div
        className="w-full glass-morphism rounded-lg p-2 flex flex-col items-center justify-center space-y-1.5 hover:shadow-md transition-shadow bookmark-item cursor-pointer"
        style={{ maxWidth: "120px", height: "auto", minHeight: "60px" }}
      >
        {children}
      </div>
    </div>
  );
};

export default DraggableBookmark;
