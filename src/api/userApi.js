import axios from "axios";
import {USER} from "./config.js";

export const postLogin = async (loginParam) => {
  const header = {headers: {"Content-Type": "x-www-form-urlencoded"}}
  const form = new FormData()
  form.append('username', loginParam.email)
  form.append('password', loginParam.password)

  return (await axios.post(`${USER}/login`, form, header)).data
}