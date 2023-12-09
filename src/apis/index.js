import axios from "axios";
import { API_ROOT } from "~/utils/constants";
export const fetchBoardDetails_API = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`);
  //axios tra ve ket qua thong qua property cua no la data
  return response.data;
};
export const updateBoardDetails_API = async (boardId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );
  //axios tra ve ket qua thong qua property cua no la data
  return response.data;
};
export const moveCardToDiffentColumnAPI = async (updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  );
  //axios tra ve ket qua thong qua property cua no la data
  return response.data;
};
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  //axios tra ve ket qua thong qua property cua no la data
  return response.data;
};
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData);
  //axios tra ve ket qua thong qua property cua no la data
  return response.data;
};
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData);

  //axios tra ve ket qua thong qua property cua no la data
  return response.data;
};
