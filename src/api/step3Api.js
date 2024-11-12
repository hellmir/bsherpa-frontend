import {BOOK, EXAM, QUESTION_EXTERNAL} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";

export const getQuestionData = async (itemIds) => {
    const params = {itemIds : itemIds.join(',')};
    return (await jwtAxios.get(`${QUESTION_EXTERNAL}`, {params: params})).data;
}
export const getBookData = async (bookId) => {
    const params = {subjectId : bookId};
    return (await jwtAxios.get(`${BOOK}/external`, {params: params})).data;
}

export const registerExam = async (exam) => {
    const header = {headers: {"Content-Type" : "application/json"}}
    return await jwtAxios.post(`${EXAM}/step03/register`, exam, header);
}