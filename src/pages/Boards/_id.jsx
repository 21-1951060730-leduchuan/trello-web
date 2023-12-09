import { useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "../../components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { mapOrder } from "~/utils/sorts";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect } from "react";
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetails_API,
  moveCardToDiffentColumnAPI,
  updateBoardDetails_API,
  updateColumnDetailsAPI,
} from "~/apis";

import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "~/utils/formatter";
function Board() {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    const boardId = "6564d0896d18edd2b09d0fde";
    //call api
    // board trong .then la du lieu response.data tra ve tu backend o day la 1 board
    // set lai board lay tu api cho board
    fetchBoardDetails_API(boardId).then((board) => {
      //sap xep thu tu column truoc khi dua xuong component con video 71
      board.columns = mapOrder(board?.columns, board?.columnsOrderIds, "_id");
      board.columns.forEach((column) => {
        //keo tha column rong
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, "_id");
        }
      });
      setBoard(board);
    });
  }, []);
  //goi api tao column lam moi du lieu state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

    // console.log(createdColumn);
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });
    // console.log(createdColumn);
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard);
      columnToUpdate.cardOrderIds.push(createdCard);
    }
    setBoard(newBoard);
  };
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);
    //goi api update board
    updateBoardDetails_API(newBoard._id, {
      columnsOrderIds: dndOrderedColumnsIds,
    });
  };
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    //update chuan du lieu state board
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);

    //update api column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
  };
  //khi di chuyen card sang column khac
  // b1 : cap nhat mang cardOrderIds cua column ban dau chua no (xoa no ra khoi mang ban dau)
  // b2 : cap nhat mang cardOrderIds cua column  tiep theo (them no vao mang moi)
  // b3 : cap nhat truong columnId CUA CARD da keo
  // => api sp rieng
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);
    //goi api phia BE
    moveCardToDiffentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds,
      nextColumnId,
      nextCardOrderIds:dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds,
    })
  };
  if (!board) {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    );
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}

export default Board;
