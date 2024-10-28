import {lazy, Suspense} from "react";

const Loading = <div>Loading...</div>
const Step0 = lazy(()=>import("../pages/step/Step0Page.jsx"))
const Step1 = lazy(()=>import("../pages/step/Step1Page.jsx"))
const Step2 = lazy(()=>import("../pages/step/Step2Page.jsx"))
const Step3 = lazy(()=>import("../pages/step/Step3Page.jsx"))
const Step4 = lazy(()=>import("../pages/step/Step4Page.jsx"))
const stepRouter = () => {
  return [
    {
      path:'step0',
      element:<Suspense fallback={Loading}><Step0/></Suspense>,
    },
    {
      path:'step1',
      element:<Suspense fallback={Loading}><Step1/></Suspense>,
    },
    {
      path:'step2',
      element:<Suspense fallback={Loading}><Step2/></Suspense>,
    },
    {
      path:'step3',
      element:<Suspense fallback={Loading}><Step3/></Suspense>,
    },
    {
      path:'step4',
      element:<Suspense fallback={Loading}><Step4/></Suspense>,
    },
  ]
}

export default stepRouter