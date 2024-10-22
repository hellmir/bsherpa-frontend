import axios from "axios";
import {USER} from "./config.js";

export const postLogin = async (loginParam) => {
  const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}
  const form = new FormData()
  form.append('username', loginParam.email)
  form.append('password', loginParam.password)

  return (await axios.post(`${USER}/login`, form, header)).data
}


export const postJoin = async (joinParam) => {
  const header = {headers: {'Content-Type': 'multipart/form-data'}}
  return (await axios.post(`${USER}/join`, joinParam, header)).data
}