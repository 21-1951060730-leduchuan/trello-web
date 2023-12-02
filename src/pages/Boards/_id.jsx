import { useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "../../components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";

import { useEffect } from "react";
import {
  createNewCardAPI,
  createNewColumnAPI,
  fetchBoardDetails_API,
} from "~/apis";
import { mockData } from "~/apis/Mock-data";
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
      //keo tha column rong
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
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
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
      />
    </Container>
  );
}

export default Board;
