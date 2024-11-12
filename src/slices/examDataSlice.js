import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    bookId: null,
    totalQuestions: null,
    groupedItems: [],
    step1Data: null
};

const examDataSlice = createSlice({
    name: 'examData',
    initialState,
    reducers: {
        setExamData(state, action) {
            state.bookId = action.payload.bookId;
            state.totalQuestions = action.payload.totalQuestions;
            state.groupedItems = action.payload.groupedItems;
            state.step1Data = action.payload.step1Data;
        },
        clearExamData(state) {
            state.bookId = null;
            state.totalQuestions = null;
            state.groupedItems = [];
            state.step1Data = null;
        }
    },
});

export const {setExamData, clearExamData} = examDataSlice.actions;
export default examDataSlice.reducer;
