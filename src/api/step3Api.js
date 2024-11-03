import {EXAM, QUESTION_EXTERNAL} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";
import axios from "axios";

export const getQuestionData = async (itemIds) => {
    const params = {itemIds : itemIds.join(',')};
    return (await axios.get(`${QUESTION_EXTERNAL}`, {params: params})).data;
}

export const registerExam = async (exam) => {
    const header = {headers: {"Content-Type" : "application/json"}}
    return await jwtAxios.post(`${EXAM}/step03/register`, exam, header);
}