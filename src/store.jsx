import {configureStore} from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice.jsx";

export default configureStore({
  reducer: {
    "loginSlice": loginSlice
  }
})