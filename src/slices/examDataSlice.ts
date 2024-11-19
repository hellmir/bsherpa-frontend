import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Item} from "../type/Item";

interface GroupedItem {
    passageId: string | number;
    passageUrl?: string | null;
    items: Item[];
}

interface ExamDataState {
    bookId: string | number | null;
    totalQuestions: number | null;
    groupedItems: GroupedItem[];
    step1Data: any; // Replace `any` with a proper type if available
}

const initialState: ExamDataState = {
    bookId: null,
    totalQuestions: null,
    groupedItems: [],
    step1Data: null,
};

const examDataSlice = createSlice({
    name: 'examData',
    initialState,
    reducers: {
        setExamData(state, action: PayloadAction<ExamDataState>) {
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
        },
    },
});

export const {setExamData, clearExamData} = examDataSlice.actions;
export default examDataSlice.reducer;
