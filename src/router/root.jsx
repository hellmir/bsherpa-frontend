import {createBrowserRouter, Navigate} from "react-router-dom";
import {lazy, Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";
import stepRouter from "./stepRouter.jsx";

const Loading = <Box sx={{display: 'flex'}}><CircularProgress/></Box>
const Main = lazy(() => import("../pages/MainPage.jsx"))
const StepIndex = lazy(() => import("../pages/step/StepIndexPage.jsx"))
const Error404 = lazy(()=>import("../pages/Error404.jsx"))

const root = createBrowserRouter([
  {
    path: '/:subjectName',
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: '/:국어',
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: '/',
    element: <Navigate replace to={'/국어'}/>
  },
  {
    path: '/exam',
    element: <Suspense fallback={Loading}><StepIndex/></Suspense>,
    children: stepRouter()
  },
  {
    path: '*',
    element: <Suspense fallback={Loading}><Error404/></Suspense>
  }
])

export default root