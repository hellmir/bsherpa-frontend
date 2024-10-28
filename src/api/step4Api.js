import axios from "axios";
import {API_SERVER_HOST} from "./config.js";

export const getItemDetails = async () =>{
    console.log("getItemDetails()");
    const header = {headers: {'Content-Type': 'application/json'}}
    return (await axios.get(`${API_SERVER_HOST}/questions/external/exam?examId=1416`, header)).data
}