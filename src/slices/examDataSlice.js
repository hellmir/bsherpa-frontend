import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    bookId: null,
    groupedItems: [],
};

const examDataSlice = createSlice({
    name: 'examData',
    initialState,
    reducers: {
        setExamData(state, action) {
            state.bookId = action.payload.bookId;
            state.groupedItems = action.payload.groupedItems;
        },
        clearExamData(state) {
            state.bookId = null;
            state.groupedItems = [];
        }
    },
});

export const {setExamData, clearExamData} = examDataSlice.actions;
export default examDataSlice.reducer;
