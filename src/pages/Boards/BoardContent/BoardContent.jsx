import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  // PointerSensor,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });
  //YEU CAU chuot di chuyen 10px moi kich hoat event , fix case click bi goi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  //nhan giu 250ms va dung sai cam ung 500px moi kich hoat event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });

  // const sensors = useSensors(pointerSensor);
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);

  useEffect(() => {
    //sap xep keo tha theo _id cua column
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return; // tranh loi khi keo tha toi noi co gia tri null
    //neu bi tri keo tha khac voi vi tri ban dau
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id); //lay vi tri cu trc khi keo
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id); //vi tri sau khi keo
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex); //sap xep keo tha bang arrayMove
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id); //du lieu sau khi da keo tha
      setOrderedColumns(dndOrderedColumns);
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "##34495e" : "#1565c0",
          height: (theme) => theme.trello.boardContentHeight,
          width: "100%",
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  );
}

export default BoardContent;
