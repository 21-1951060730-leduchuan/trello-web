import { useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "../../components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { mockData } from "~/apis/Mock-data";
import { useEffect } from "react";
import { fetchBoardDetails_API } from "~/apis";
function Board() {
  const [board, setBoard] = useState(null);
  useEffect(() => {
    const boardId = "6564a7be15706c310c647dbb";
    //call api
    // board trong .then la du lieu response.data tra ve tu backend o day la 1 board
    // set lai board lay tu api cho board
    fetchBoardDetails_API(boardId).then((board) => {
      setBoard(board);
    });
  }, []);
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  );
}

export default Board;
