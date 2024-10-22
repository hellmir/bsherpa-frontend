import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";

const Loading = <Box sx={{ display: 'flex' }}><CircularProgress /></Box>
const Main = lazy(()=>import("../pages/MainPage.jsx"))
const root = createBrowserRouter([
  {
    path:'/',
    element: <Suspense fallback={Loading}><Main/></Suspense>
  }
])

export default root