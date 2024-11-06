import axios from "axios";
import {API_SERVER_HOST} from "./config.js";
import jwtAxios from "../util/jwtUtil.jsx";

export const getItemTest = async () =>{
    try{
        console.log("getItemTest()");
        const header = {headers: {'Content-Type': 'application/json'}};
        const response = await jwtAxios.get(`${API_SERVER_HOST}/exams/31`, header);
        return response.data;
        //return (await axios.get(`${API_SERVER_HOST}/exam`, header)).data;
    }catch(error){
        console.log("API 호출 오류: ", error)
        throw error;
    }
}