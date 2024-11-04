import {BOOK, EXTERNAL} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";

export const getSubjectExamsFromTsherpa = async (bookId) => {
  return (await jwtAxios.get(`${BOOK}/${EXTERNAL}/exams`,{params:{subjectId:bookId}})).data
}