import axios from "axios";
import {BOOK} from "./config.js";

export const getBook = async () => {
  return (await axios.get(`${BOOK}`)).data
}