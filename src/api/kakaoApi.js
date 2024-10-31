import axios from "axios";
import {USER} from "./config.js";

const OAUTH_AUTHORIZATION_URL = 'https://kauth.kakao.com/oauth/authorize'
const OAUTH_TOKEN_URL = 'https://kauth.kakao.com/oauth/token'
const REDIRECT_URI = 'https://bsherpa.com/users/kakao'
const REST_API_KEY = import.meta.env.VITE_REST_API_KEY
export const getKakaoLink = () => {
  return `${OAUTH_AUTHORIZATION_URL}?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
}

export const getAccessToken = async (authCode) => {
  const header = {headers: {'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'}}
  const params = {
    grant_type: 'authorization_code',
    client_id: REST_API_KEY,
    redirect_uri: REDIRECT_URI,
    code: authCode
  }

  const res = await axios.post(OAUTH_TOKEN_URL, params, header)
  return res.data.access_token
}

export const getUserWithAccessToken = async (accessToken) => {
  const res = await axios.get(`${USER}/kakao?accessToken=${accessToken}`)
  return res.data
}