import axios from "axios";
import {BOOK, EXAM} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";

export const getBook = async () => {
  return (await axios.get(`${BOOK}`)).data

}
export const getExam = async (email) => {
  const params = { email: email };
  return (await jwtAxios.get(`${EXAM}/storage`, {params})).data;
}