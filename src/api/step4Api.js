import {API_SERVER_HOST} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";
import axios from "axios";

export const getExamTest = async (examId) =>{
    try{
        const header = {headers: {'Content-Type': 'application/json'}};
        const response = await jwtAxios.get(`${API_SERVER_HOST}/exams/${examId}`, header);
        return response.data;

    }catch(error){
        console.log("API 호출 오류: ", error)
        throw error;
    }
}