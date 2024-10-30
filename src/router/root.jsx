import {createBrowserRouter, Navigate} from "react-router-dom";
import {lazy, Suspense} from "react";
import {Box, CircularProgress} from "@mui/material";
import stepRouter from "./stepRouter.jsx";

const Loading = <Box sx={{display: 'flex'}}><CircularProgress/></Box>
const Main = lazy(() => import("../pages/MainPage.jsx"))
const Join = lazy(()=>import("../pages/user/JoinPage.jsx"))
const StepIndex = lazy(() => import("../pages/step/StepIndexPage.jsx"))
const KakaoRedirect = lazy(()=>import("../pages/user/KakaoRedirectPage.jsx"))
const Error404 = lazy(()=>import("../pages/Error404.jsx"))

const root = createBrowserRouter([
  {
    path: '/',
    element: <Suspense fallback={Loading}><Main/></Suspense>
  },
  {
    path: '/exam',
    element: <Suspense fallback={Loading}><StepIndex/></Suspense>,
    children: stepRouter()
  },
  {
    path:'/users/join',
    element: <Suspense fallback={Loading}><Join/></Suspense>
  },
  {
    path:'/users/kakao',
    element: <Suspense fallback={Loading}><KakaoRedirect/></Suspense>
  },
  {
    path: '*',
    element: <Suspense fallback={Loading}><Error404/></Suspense>
  }
])

export default root