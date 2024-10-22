import {useNavigate} from "react-router-dom";

const useCustomMove = () => {

  const navigate = useNavigate()

  const moveToPath = (path) => {
    navigate({pathname:path},{replace:true})
  }

  return {moveToPath}
}


export default useCustomMove