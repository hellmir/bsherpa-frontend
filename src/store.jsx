import {configureStore} from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice.jsx";
import examIdSlice from "./slices/examIdSlice.jsx";
import bookIdSlice from "./slices/bookIdSlice.jsx";
import examDataSlice from "./slices/examDataSlice.ts";

export default configureStore({
    reducer: {
        "loginSlice": loginSlice,
        "examIdSlice": examIdSlice,
        "bookIdSlice": bookIdSlice,
        "examDataSlice": examDataSlice
    }
})