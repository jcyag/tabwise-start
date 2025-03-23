
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { cn } from "@/lib/utils";

interface GroupDragContainerProps {
  children: React.ReactNode;
  groupId: string;
  index: number;
  onMoveGroup: (dragIndex: number, hoverIndex: number) => void;
  onDropBookmark: (bookmarkId: string, targetGroupId: string) => void;
}

const GroupDragContainer = ({
  children,
  groupId,
  index,
  onMoveGroup,
  onDropBookmark,
}: GroupDragContainerProps) => {
  const groupRef = useRef<HTMLDivElement>(null);

  // Make the group draggable
  const [{ isDragging }, drag] = useDrag({
    type: "GROUP",
    item: { index, type: "GROUP", id: groupId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Make the group a drop target for bookmarks and other groups
  const [{ isOver }, drop] = useDrop({
    accept: ["BOOKMARK", "GROUP"],
    drop: (item: any) => {
      if (item.type === "BOOKMARK" && item.groupId !== groupId) {
        onDropBookmark(item.id, groupId);
      }
      return undefined;
    },
    hover: (item: any, monitor) => {
      // Only handle group drops here
      if (item.type !== "GROUP") return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return;
      
      // Get rectangle on screen
      if (!groupRef.current) return;
      const hoverBoundingRect = groupRef.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Get mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      // Time to actually perform the action
      onMoveGroup(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Connect drag and drop refs
  drag(drop(groupRef));

  return (
    <div 
      ref={groupRef} 
      className={cn(
        "mb-6 w-full fade-in cursor-grab",
        isOver && "ring-2 ring-blue-300 bg-slate-50/80",
        isDragging && "opacity-50"
      )}
    >
      {children}
    </div>
  );
};

export default GroupDragContainer;
