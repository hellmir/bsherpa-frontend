import axios from "axios";
import {BOOK, EXTERNAL, QUESTION_IMAGE} from "./config.js";

export const getBookFromTsherpa = async (bookId) => {
    return (await axios.get(`${BOOK}/${EXTERNAL}`, {params: {subjectId: bookId}})).data
}

export const getEvaluationsFromTsherpa = async (bookId) => {
    return (await axios.get(`${BOOK}/${EXTERNAL}/evaluations`, {params: {subjectId: bookId}})).data
}

export const getItemImagesFromTsherpa = async (itemsRequestForm) => {
    const header = {headers: {'Content-Type': 'application/json'}}

    return await axios.post(`${QUESTION_IMAGE}/${EXTERNAL}/chapters`, itemsRequestForm, header)
}
