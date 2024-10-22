import {createBrowserRouter} from "react-router-dom";
import {lazy, Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";
import stepRouter from "./stepRouter.jsx";

const Loading = <Box sx={{ display: 'flex' }}><CircularProgress /></Box>
const Main = lazy(()=>import("../pages/MainPage.jsx"))
const StepIndex = lazy(()=>import("../pages/step/StepIndexPage.jsx"))

const root = createBrowserRouter([
  {
    path:'/',
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path:'/exam',
    element:<Suspense fallback={Loading}><StepIndex/></Suspense>,
    children: stepRouter()
  }
])

export default root