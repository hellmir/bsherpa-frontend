import {Navigate, useNavigate} from "react-router-dom";
import {useState} from "react";

const useCustomMove = () => {

  const navigate = useNavigate()
  const [refresh, setRefresh] = useState(false)

  const moveToPath = (path) => {
    setRefresh(!refresh)
    navigate({pathname:path},{replace:true})
  }

  const moveToStepWithData = (path,data) => {
    setRefresh(!refresh)
    navigate(
        {pathname:`/exam/${path}`},
        {state:{data}},
        {replace:true}
    )
  }

  const moveToMainReturn = () => {
    return <Navigate replace to="/"/>
  }

  const moveToPathWithData = (path,data) => {
    setRefresh(!refresh)
    navigate(
        {pathname:path},
        {state:{data}},
        {replace:true}
    )
  }

  return {moveToPath,moveToPathWithData,moveToStepWithData,refresh,moveToMainReturn}
}


export default useCustomMove