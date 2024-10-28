import {createSlice} from "@reduxjs/toolkit";

const initState = []

const bookIdSlice = createSlice({
  name: 'bookIdSlice',
  initialState: initState,
  reducers:{
    addBookId:(state,action)=>{
      return action.payload
    }
  }
})

export const {addBookId} = bookIdSlice.actions

export default bookIdSlice.reducer