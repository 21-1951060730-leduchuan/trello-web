import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";

import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { cloneDeep, isEmpty } from "lodash";
import {
  DndContext,
  // PointerSensor,
  useSensor,
  // MouseSensor,
  // TouchSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import { MouseSensor, TouchSensor } from "~/customLibraries/DndKitSensors";
import { arrayMove } from "@dnd-kit/sortable";
import { useRef, useCallback, useEffect, useState } from "react";
import { generatePlaceholderCard } from "~/utils/formatter";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails,
}) {
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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);
  // diem va cham cuoi cung (xu li thuat toan va cham 37)
  const lastOverId = useRef(null);

  useEffect(() => {
    //sap xep keo tha theo _id cua column
    setOrderedColumns(board?.columns);
  }, [board]);
  // tim 1 column theo cardID
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };
  const moveCardBeetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
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
        //
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }
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
        // phai cap nhat lai chuan du lieu columnId trong card sau khi keo card giua 2 column khac nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }
      if (triggerFrom === "handleDragEnd") {
        //
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        );
      }
      return nextColumns;
    });
  };
  const handleDragStart = (event) => {
    setActiveDragItemsId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
    //neu keo card thi moi set gia tri old column
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
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
      moveCardBeetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        "handleDragOver"
      );
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return; // tranh loi khi keo tha toi noi co gia tri null
    //HANH DONG keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
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

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBeetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          "handleDragEnd"
        );
      } else {
        // hanh dong keo tha card trong cung 1 column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex(
          (c) => c._id === activeDragItemId
        ); //lay vi tri cu tu thagn oldColumnWhenDraggingCard

        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        ); //lay vi tri cu trc khi keo tu overColumn
        //
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        ); //sap xep keo tha bang arrayMove
        const dndOrderedCardIds = dndOrderedCards.map((card) => card._id);

        setOrderedColumns((prevColumns) => {
          const nextColumns = cloneDeep(prevColumns);
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCardIds;
          //tra ve gia tri state moi chuan vi tri
          return nextColumns;
        });
        //goi api
        moveCardInTheSameColumn(
          dndOrderedCards,
          dndOrderedCardIds,
          oldColumnWhenDraggingCard._id
        );
      }
    }

    //neu bi tri keo tha khac voi vi tri ban (xu li keo tha column trong boardContent)
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        ); //lay vi tri cu trc khi keo
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        ); //vi tri sau khi keo
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        ); //sap xep keo tha bang arrayMove
        // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id); //du lieu sau khi da keo tha
        setOrderedColumns(dndOrderedColumns);
        moveColumns(dndOrderedColumns);
      }
    }

    setActiveDragItemsId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setOldColumnWhenDraggingCard(null);
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
  const collisionDetectionStratery = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      //37.1
      const pointerIntersections = pointerWithin(args);
      if (!pointerIntersections?.length) {
        return;
      }
      // eslint-disable-next-line no-extra-boolean-cast
      // const intersections = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args);
      let overId = getFirstCollision(pointerIntersections, "id");
      if (overId) {
        const checkColumn = orderedColumns.find((c) => c._id === overId);
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container._id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }

        lastOverId.current = overId;
        return [{ id: overId }];
      }
      // neu overId null t hi tra ve mang rong
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType, orderedColumns]
  );
  return (
    <DndContext
      //cam bien
      sensors={sensors}
      collisionDetection={collisionDetectionStratery} //thuat toan phai hien va cham cua dndkit update 37
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
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
        />

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
