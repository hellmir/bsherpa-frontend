import axios from "axios";
import {BOOK, EXAM, EXTERNAL, QUESTION_EXTERNAL, QUESTION_IMAGE} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";

export const getBook = async () => {
  return (await axios.get(`${BOOK}`)).data

}
export const getExam = async (email,subjectName) => {
  const params = { email: email, subjectName: subjectName };
  return (await jwtAxios.get(`${EXAM}`, {params})).data;
}

export const getQuestionImageData = async (itemIds) => {
  const params = {itemIds : itemIds.join(',')};
  return (await jwtAxios.get(`${QUESTION_IMAGE}/${EXTERNAL}`, {params: params})).data;
}