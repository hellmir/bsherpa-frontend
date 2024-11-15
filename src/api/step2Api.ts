// @ts-ignore
import jwtAxios from "../util/jwtUtil";
// @ts-ignore
import {BOOK, ERROR_REPORT, EXTERNAL, QUESTION_IMAGE} from "./config";

export interface ItemsRequestForm {
    activityCategoryList: string[];
    levelCnt: number[];
    minorClassification: string[];
    questionForm: string;
}

export const getBookFromTsherpa = async (bookId: number): Promise<any> => {
    return (await jwtAxios.get(`${BOOK}/${EXTERNAL}`, {params: {subjectId: bookId}})).data;
}

export const getEvaluationsFromTsherpa = async (bookId: number): Promise<any> => {
    return (await jwtAxios.get(`${BOOK}/${EXTERNAL}/evaluations`, {params: {subjectId: bookId}})).data;
}

export const getAdjustedChapterItemImagesFromTsherpa = async (itemsRequestForm: ItemsRequestForm): Promise<any> => {
    const header = {headers: {'Content-Type': 'application/json'}};

    return await jwtAxios.post(`${QUESTION_IMAGE}/${EXTERNAL}/chapters/adjust`, itemsRequestForm, header);
}

export const getExamItemImagesFromTsherpa = async (examId: number): Promise<any> => {
    return (await jwtAxios.get(`${QUESTION_IMAGE}/${EXTERNAL}/exam`, {params: {examId: examId}})).data;
}

export const getSimilarItemsImagesFromTsherpa = async (itemId: number): Promise<any> => {
    return (await jwtAxios.get(`${QUESTION_IMAGE}/${EXTERNAL}/similar-items`, {
        params: {
            itemIds: itemId,
            excludedItemIds: 0
        }
    })).data;
}

export const postRegisterErrorReport = async (registerErrorReportForm: FormData): Promise<any> => {
    const header = {headers: {'Content-Type': 'multipart/form-data'}};

    return await jwtAxios.post(`${ERROR_REPORT}`, registerErrorReportForm, header);
};
