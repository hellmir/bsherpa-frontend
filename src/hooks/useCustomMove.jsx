import {useNavigate} from "react-router-dom";

const useCustomMove = () => {

  const navigate = useNavigate()

  const moveToPath = (path) => {
    navigate({pathname:path},{replace:true})
  }

  const moveToStepWithData = (path,data) => {
    navigate(
        {pathname:`/exam/${path}`},
        {state:{data}},
        {replace:true}
    )
  }

  return {moveToPath,moveToStepWithData}
}


export default useCustomMove