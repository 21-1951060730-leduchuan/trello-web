import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sorts";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { cloneDeep } from "lodash";
import {
  DndContext,
  // PointerSensor,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

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
  //cùng 1 thời điểm chỉ được một phần tử đc kéo là comlumn hoặc card
  const [activeDragItemId, setActiveDragItemsId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  useEffect(() => {
    //sap xep keo tha theo _id cua column
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  // tim 1 column theo cardID
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  const handleDragStart = (event) => {
    setActiveDragItemsId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
  };

  //trong qua trinh keo
  const handleDragOver = (event) => {
    // khong lam gi  them neu dang keo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return;
    // xu li khi keo card
    const { active, over } = event;
    //can dam bao khi khong ton tai active hoac over (khi keo ra ngoai container) thi khong lam gi tranh crash app
    if (!active || !over) return;
    //activecard : dang duoc keo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    //overcard : dang duoc tuong tac voi activecard
    const { id: overCardId } = over;
    //tim 2 cai column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);
    // neu k ton tai  1 trong 2 column thi k lam gi het
    if (!activeColumn || !overColumn) return;

    //khi keo 2 column khac nhau thi code vao day c
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        //tim vi tri index cua overCard trong column dich(noi ma activeCard  sap duoc tha)
        const OverCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        );
        // logic tinh toan  'cardIndex' moi tren hoac duoi overCard
        let newCardIndex;
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newCardIndex =
          OverCardIndex >= 0
            ? OverCardIndex + modifier
            : overColumn?.cards?.length + 1;
        //clone mang oderColumnState cu ra 1 mang moi de xu li roi return- cap nhat laij oderColumnState moi
        const nextColumns = cloneDeep(prevColumns);
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id
        );
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id
        );
        if (nextActiveColumn) {
          //xoa card o column active
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );
          //cap nhat bang cardOderIds
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          );
        }
        if (nextOverColumn) {
          //kiem tra xem card dang keo co ton tai o overColumn k , neu co thi xoa no trc
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          );
          //them card dang keo vao vi tri index moi
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          );
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          );
        }
        return nextColumns;
      });
    }
  };

  const handleDragEnd = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      return;
    }

    const { active, over } = event;
    if (!active || !over) return; // tranh loi khi keo tha toi noi co gia tri null
    //neu bi tri keo tha khac voi vi tri ban dau
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id); //lay vi tri cu trc khi keo
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id); //vi tri sau khi keo
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex); //sap xep keo tha bang arrayMove
      // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id); //du lieu sau khi da keo tha
      setOrderedColumns(dndOrderedColumns);
    }
    setActiveDragItemsId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
  };
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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

        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
              <Column column={activeDragItemData} />
            )}
          {activeDragItemId &&
            activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
              <Card card={activeDragItemData} />
            )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
