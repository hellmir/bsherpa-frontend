import {configureStore} from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice.jsx";
import examIdSlice from "./slices/examIdSlice.jsx";

export default configureStore({
  reducer: {
    "loginSlice": loginSlice,
    "examIdSlice": examIdSlice
  }
})