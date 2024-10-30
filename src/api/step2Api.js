import axios from "axios";
import {BOOK, ERROR_REPORT, EXTERNAL, QUESTION_IMAGE} from "./config.js";

export const getBookFromTsherpa = async (bookId) => {
    return (await axios.get(`${BOOK}/${EXTERNAL}`, {params: {subjectId: bookId}})).data;
}

export const getEvaluationsFromTsherpa = async (bookId) => {
    return (await axios.get(`${BOOK}/${EXTERNAL}/evaluations`, {params: {subjectId: bookId}})).data;
}

export const getChapterItemImagesFromTsherpa = async (itemsRequestForm) => {
    const header = {headers: {'Content-Type': 'application/json'}}

    return await axios.post(`${QUESTION_IMAGE}/${EXTERNAL}/chapters`, itemsRequestForm, header);
}

export const getExamItemImagesFromTsherpa = async (examId) => {
    return (await axios.get(`${QUESTION_IMAGE}/${EXTERNAL}/exam`, {params: {examId: examId}})).data;
}

export const getSimilarItemsImagesFromTsherpa = async (itemId) => {
    return (await axios.get(`${QUESTION_IMAGE}/${EXTERNAL}/similar-items`, {
        params: {
            itemIds: itemId,
            excludedItemIds: 0
        }
    })).data;
}

export const postRegisterErrorReport = async (registerErrorReportForm) => {
    const header = {headers: {'Content-Type': 'multipart/form-data'}}

    return await axios.post(`${ERROR_REPORT}`, registerErrorReportForm, header)
}
