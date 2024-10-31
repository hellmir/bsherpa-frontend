import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {postLogin} from "../api/userApi.js";
import {getCookie, removeCookie, setCookie} from "../util/cookieUtil.jsx";

const initState = {
  email: ''
}

const loadMemberCookie = () => {
  return getCookie('user')
}

export const loginPostAsync = createAsyncThunk('loginPostAsync',(param)=>postLogin(param))

const loginSlice = createSlice({
  name: 'loginSlice',
  initialState: loadMemberCookie() || initState,
  reducers: {
    login: (state, action) => {
      console.log(action.payload)
      setCookie('user',JSON.stringify(action.payload))
      return {email: action.payload.email}
    },
    logout: () => {
      removeCookie('user')
      return {...initState}
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loginPostAsync.fulfilled,(state,action)=>{
      console.log("fulfilled")
      const payload = action.payload
      if(!payload.ERROR){
        setCookie("user",JSON.stringify(payload))
      }
      const email = payload.email
      return {
        email
      }
    })
    .addCase(loginPostAsync.pending,(state,action)=>{
      console.log('pending')
    })
    .addCase(loginPostAsync.rejected,(state,action)=>{
      console.log('rejected')
    })
  }
})

export const {login, logout} = loginSlice.actions

export default loginSlice.reducer