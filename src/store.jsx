import {configureStore} from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice.jsx";
import examIdSlice from "./slices/examIdSlice.jsx";
import bookIdSlice from "./slices/bookIdSlice.jsx";

export default configureStore({
  reducer: {
    "loginSlice": loginSlice,
    "examIdSlice": examIdSlice,
    "bookIdSlice": bookIdSlice
  }
})