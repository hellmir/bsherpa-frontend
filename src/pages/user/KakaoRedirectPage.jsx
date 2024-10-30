import {useSearchParams} from "react-router-dom";
import {getAccessToken, getUserWithAccessToken} from "../../api/kakaoApi.js";
import {useQuery} from "@tanstack/react-query";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {useDispatch} from "react-redux";
import {login} from "../../slices/loginSlice.jsx";

function KakaoRedirectPage() {

 const [searchParams] = useSearchParams()
  const authCode = searchParams.get('code')
  const {moveToPathWithData,moveToPath} = useCustomMove()
  const {data,isSuccess} = useQuery({queryKey:[authCode],queryFn:()=>getAccessToken(authCode)})
  const dispatch = useDispatch()
  if(isSuccess) {
    getUserWithAccessToken(data).then(res => {
      console.log(res)
      if (res.error){
        moveToPathWithData('/users/join',res.error)
        return
      }
      dispatch(login(res))
      moveToPath('/')
    })
  }



  return (
      <div>
카카오 로그인 중...
      </div>
  );
}

export default KakaoRedirectPage;