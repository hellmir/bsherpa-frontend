
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import LoginIcon from '@mui/icons-material/Login';
import TextFieldComponent from "./TextFieldComponent.jsx";
import {useState,useMemo, useEffect} from "react";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ModalComponent from "./ModalComponent.jsx";
import TextField from "@mui/material/TextField";
import HomeIcon from '@mui/icons-material/Home';
import {Link} from "react-router-dom";
import {getKakaoLink} from "../../api/kakaoApi.js";
import {GridViewStreamIcon} from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const drawerWidth = 240;
const initState = {
  email:'',
  password:''
}

function DrawerComponent() {
  const [result, setResult] = useState(null)
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const {doLogin,doLogout,moveToPath,isLogin,loginState} = useCustomLogin()
  const [user, setUser] = useState(initState)
  const [currentUsername, setCurrentUsername] = useState('')  // 현재 유저명을 저장할 상태 추가
   // loginState가 변경될 때마다 username 업데이트
   useEffect(() => {
    if (loginState?.accessToken) {
      try {
        const payload = loginState.accessToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        const decoded = decodeURIComponent(escape(decodedPayload.username)) || '';
        setCurrentUsername(decoded);
      } catch (e) {
        console.error('JWT decoding failed:', e);
        setCurrentUsername(loginState.username || '');
      }
    } else {
      setCurrentUsername('');
    }
  }, [loginState]);
  const handleChange = (e) => {
    user[e.target.name] = e.target.value
    setUser({...user})
  }

  const handleClickLogin = () => {
    console.log('로그인 클릭')
    console.log(user)
    doLogin(user)
      .then(data => {
        console.log('로그인 응답:', data)
        if (data.error) {
          setFail(true)
        } else {
          console.log('로그인 성공')
          try {
            const decodedUsername = decodeURIComponent(
              escape(
                JSON.parse(
                  atob(data.accessToken.split('.')[1])
                ).username
              )
            )
            setResult({
              original: data.username || '',
              decoded: decodedUsername || ''
            })
            setCurrentUsername(decodedUsername)  // 즉시 username 업데이트
            setSuccess(true)
            setUser(initState)  // 입력 필드 초기화
          } catch (error) {
            console.error('디코딩 에러:', error)
            setResult({
              original: data.username || '',
              decoded: data.username || ''
            })
            setCurrentUsername(data.username || '')
            setSuccess(true)
          }
        }
      })
  }

  const handleClickLogOut = () => {
    doLogout()
    moveToPath('/')
  }

  const handleClickText = (e) => {
    const value = e.target.textContent
    console.log(value)
    if (value==='회원가입'){
      moveToPath('/users/join')
    }
    if (value==='Home'){
      moveToPath('/')
    }
  }

  const handleClickLink = (link) => {
    window.location.href = link;
  }

  const handleClose = () => {
    setSuccess(false)  // 성공 모달 닫기
    setFail(false)     // 실패 모달 닫기
    if (success) {     // 성공했을 경우에만 홈으로 이동
      moveToPath('/')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClickLogin();
    }
  }
  const decodeUsername = useMemo(() => {
    if (!loginState?.accessToken) return '';
    
    try {
      // JWT의 payload 부분 추출
      const payload = loginState.accessToken.split('.')[1];
      // Base64 디코딩 후 JSON 파싱
      const decodedPayload = JSON.parse(atob(payload));
      // 추가 디코딩 시도
      return decodeURIComponent(escape(decodedPayload.username)) || '';
    } catch (e) {
      console.error('JWT decoding failed:', e);
      // 디코딩 실패 시 원본 반환
      return loginState.username || '';
    }
  }, [loginState?.accessToken]);

  return (
    <>
       {success && result ? (
      <ModalComponent
        open={success}
        title={`안녕하세요 ${result.decoded}님`}
        content={'로그인 되셨습니다.'}
        
        handleClose={handleClose}
      />
    ) : null}
      {fail ? <ModalComponent
        open={fail}
        title={`안녕하세요 로그인에 실패하셨습니다`}
        content={'아이디와 비밀번호를 다시 확인해주세요'}
        handleClose={handleClose}
      /> : <></>}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <List>
            {isLogin ?
              <>
                <ListItemButton>
                  <ListItemIcon>
                    <LoginIcon
                      onClick={handleClickLogOut}/>
                  </ListItemIcon>
                  <ListItemText
                    primary={'로그아웃'}
                    onClick={handleClickLogOut}
                  />
                </ListItemButton>
                <TextField
                  readOnly
                  margin="dense"
                  id={'loginUserName'}
                  name={'username'}
                  type={'text'}
                  label={'유저명'}
                  value={currentUsername}
                  fullWidth
                  variant="filled"
                />
              </>
              :
              <>
                <ListItemButton>
                  <ListItemIcon>
                    <LoginIcon
                      onClick={handleClickLogin}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={'로그인'}
                    onClick={handleClickLogin}
                  />
                </ListItemButton>
                <TextFieldComponent
                  id={'email'}
                  name={'email'}
                  type={'email'}
                  label={'이메일'}
                  value={user.email}
                  handleChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
                <TextFieldComponent
                  auto={false}
                  id={'password'}
                  name={'password'}
                  type={'password'}
                  label={'비밀번호'}
                  value={user.password}
                  handleChange={handleChange}
                  onKeyPress={handleKeyPress}
                />
              </>
            }
          </List>
          <Divider />
          <List>
            {!isLogin && (
              <ListItemButton>
                <ListItemIcon>
                  <Link to={getKakaoLink()}>
                    <LoginIcon />
                  </Link>
                </ListItemIcon>
                <Link
                  style={{textDecoration:'none',color:'inherit'}}
                  to={getKakaoLink()}>
                  <ListItemText
                    primary={'회원가입'}
                  />
                </Link>
              </ListItemButton>
            )}
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText 
                primary={'Home'}
                onClick={handleClickText}
              />
            </ListItemButton>
            <ListItemButton onClick={() => handleClickLink('https://exsherpa.com')}>
              <ListItemIcon>
                <GridViewStreamIcon />
              </ListItemIcon>
              <ListItemText primary={'EX셀파로 이동'} />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default DrawerComponent;