import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import LoginIcon from '@mui/icons-material/Login';
import TextFieldComponent from "./TextFieldComponent.jsx";
import {useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ModalComponent from "./ModalComponent.jsx";
import TextField from "@mui/material/TextField";
import HomeIcon from '@mui/icons-material/Home';
import {Link} from "react-router-dom";
import {getKakaoLink} from "../../api/kakaoApi.js";

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

const handleChange = (e) => {
  user[e.target.name] = e.target.value
  setUser({...user})
}

const handleClickLogin = () => {
  console.log('로그인 클릭')
  console.log(user)
  doLogin(user)
  .then(data => {
    console.log(data)
    if (data.error) {
      setFail(true)
    } else {
      console.log('로그인 성공')

      setSuccess(true)
      setResult(data.username)
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
  if (value==='홈'){
    moveToPath('/')
  }
}
  const handleClose = () => {
    if (result) {
      setResult(null)
      moveToPath('/')
    }
    if (fail) {
      setFail(false)
    }
  }

  return (
      <>
        {result ? <ModalComponent
                open={success}
                title={`안녕하세요 ${result}, 님`}
                content={"로그인 하셨습니다."}
                handleClose={handleClose}
            />
            :
            <></>}
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
        <Toolbar />
        <Divider />
        <List>

          {isLogin?
              <>{
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
                }
                <TextField
                    readOnly
                    margin="dense"
                    id={'loginUserName'}
                    name={'username'}
                    type={'text'}
                    label={'유저명'}
                    value={loginState.username}
                    fullWidth
                    variant="filled"
                />


              </>
                :
              <>
                      <ListItemButton>
                        <ListItemIcon>
                          <Link to={getKakaoLink()}>
                          <LoginIcon
                              // onClick={handleClickLogin}
                          />
                          </Link>
                        </ListItemIcon>
                        <Link to={getKakaoLink()}>

                        <ListItemText
                            primary={'login'}
                            // onClick={handleClickLogin}
                        />
                        </Link>
                      </ListItemButton>
                <TextFieldComponent
                    id={'email'}
                    name={'email'}
                    type={'email'}
                    label={'이메일'}
                    value={user.email}
                    handleChange={handleChange}
                />
                <TextFieldComponent
                    auto={false}
                    id={'password'}
                    name={'password'}
                    type={'password'}
                    label={'비밀번호'}
                    value={user.password}
                    handleChange={handleChange}
                />
              </>
          }
        </List>
        <Divider />
        <List>
          {
                <ListItemButton>
                  <ListItemIcon>
                     <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={'Home'}
                                onClick={handleClickText}
                  />
                </ListItemButton>
          }
        </List>
      </Drawer>
      </>
  );
}

export default DrawerComponent;