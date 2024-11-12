import axios from "axios";
import jwtAxios from "../util/jwtUtil.jsx";

import {BOOK, ERROR_REPORT, EXTERNAL, QUESTION_IMAGE} from "./config.js";

export const getBookFromTsherpa = async (bookId) => {
    return (await jwtAxios.get(`${BOOK}/${EXTERNAL}`, {params: {subjectId: bookId}})).data;
}

export const getEvaluationsFromTsherpa = async (bookId) => {
    return (await jwtAxios.get(`${BOOK}/${EXTERNAL}/evaluations`, {params: {subjectId: bookId}})).data;
}

export const getAdjustedChapterItemImagesFromTsherpa = async (itemsRequestForm) => {
    const header = {headers: {'Content-Type': 'application/json'}}

    return await jwtAxios.post(`${QUESTION_IMAGE}/${EXTERNAL}/chapters/adjust`, itemsRequestForm, header);
}

export const getExamItemImagesFromTsherpa = async (examId) => {
    return (await jwtAxios.get(`${QUESTION_IMAGE}/${EXTERNAL}/exam`, {params: {examId: examId}})).data;
}

export const getSimilarItemsImagesFromTsherpa = async (itemId) => {
    return (await jwtAxios.get(`${QUESTION_IMAGE}/${EXTERNAL}/similar-items`, {
        params: {
            itemIds: itemId,
            excludedItemIds: 0
        }
    })).data;
}

export const postRegisterErrorReport = async (registerErrorReportForm) => {
    const header = {headers: {'Content-Type': 'multipart/form-data'}}

    return await jwtAxios.post(`${ERROR_REPORT}`, registerErrorReportForm, header)
}
