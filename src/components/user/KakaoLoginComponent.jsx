import Button from "@mui/material/Button";
import {getKakaoLink} from "../../api/kakaoApi.js";
import {Link} from "react-router-dom";

function KakaoLoginComponent() {

  const kakaoLink = getKakaoLink()

  return (
      <Link to={kakaoLink}>
        <Button variant="contained" disableElevation>
          로그인
        </Button>
      </Link>
  );
}

export default KakaoLoginComponent;