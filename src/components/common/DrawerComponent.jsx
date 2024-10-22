import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import LoginIcon from '@mui/icons-material/Login';
import TextFieldComponent from "./TextFieldComponent.jsx";
import {useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ModalComponent from "./ModalComponent.jsx";
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const drawerWidth = 240;
const initState = {
  email:'',
  password:''
}


function DrawerComponent() {
  const [result, setResult] = useState(null)
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
const {doLogin,moveToPath} = useCustomLogin()
  const [user, setUser] = useState(initState)

const handleChange = (e) => {
  user[e.target.name] = e.target.value
  setUser({...user})
}

const handleClickLogin = () => {
  console.log('로그인 클릭')
  doLogin(user)
  .then(data => {
    if (data.ERROR) {
      setFail(true)
    } else {
      setSuccess(true)
      setResult(data.username)
    }
  })
}

const handleClickText = (e) => {
  const value = e.target.textContent
  console.log(value)
  if (value==='회원가입'){
    moveToPath('/users/join')
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
          {['로그인'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <LoginIcon onClick={handleClickLogin}/> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText
                      primary={text}
                      onClick={handleClickLogin}
                  />
                </ListItemButton>
              </ListItem>
          ))}
          <TextFieldComponent
          id={'email'}
          type={'email'}
          label={'이메일'}
          value={user.email}
          handleChange={handleChange}
          />
          <TextFieldComponent
              auto={false}
              id={'password'}
              type={'password'}
              label={'비밀번호'}
              value={user.password}
              handleChange={handleChange}
          />
        </List>
        <Divider />
        <List>
          {['회원가입', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <PersonAddAltIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text}
                                onClick={handleClickText}
                  />
                </ListItemButton>
              </ListItem>
          ))}
        </List>
      </Drawer>
      </>
  );
}

export default DrawerComponent;