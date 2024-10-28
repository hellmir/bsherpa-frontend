import axios from "axios";
import {BOOK} from "./config.js";

export const getSubjectExamsFromTsherpa = async (bookId) => {
  return (await axios.get(`${BOOK}/external/exams`,{params:{subjectId:bookId}})).data
}