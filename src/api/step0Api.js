import axios from "axios";
import {BOOK, EXTERNAL} from "./config.js";

export const getSubjectExamsFromTsherpa = async (bookId) => {
  return (await axios.get(`${BOOK}/${EXTERNAL}/exams`,{params:{subjectId:bookId}})).data
}