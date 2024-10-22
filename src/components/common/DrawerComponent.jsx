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

const drawerWidth = 240;
const initState = {
  email:'',
  password:''
}


function DrawerComponent() {

  const [user, setUser] = useState(initState)

const handleChange = (e) => {
  user[e.target.name] = e.target.value
  console.log({...user})
  setUser({...user})
}

  return (
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
                    {index % 2 === 0 ? <LoginIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
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
              id={'password'}
              type={'password'}
              label={'비밀번호'}
              value={user.password}
              handleChange={handleChange}
          />
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
          ))}
        </List>
      </Drawer>
  );
}

export default DrawerComponent;