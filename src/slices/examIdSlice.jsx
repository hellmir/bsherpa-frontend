import {createSlice} from "@reduxjs/toolkit";

const initState = []

const examIdSlice = createSlice({
  name: 'examIdSlice',
  initialState: initState,
  reducers:{
    addExamId:(state,action)=>{
      return action.payload
    }
  }
})

export const {addExamId} = examIdSlice.actions

export default examIdSlice.reducer