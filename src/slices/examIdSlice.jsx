import { createSlice } from "@reduxjs/toolkit";

const initState = [];

const examIdSlice = createSlice({
  name: 'examIdSlice',
  initialState: initState,
  reducers: {
    addExamId: (state, action) => {
      action.payload.forEach(id => {
        if (!state.includes(id)) {
          state.push(id);
        }
      });
    },
    resetExamId: () => {
      return initState
    }
  }
});

export const { addExamId,  resetExamId } = examIdSlice.actions;

export default examIdSlice.reducer;
