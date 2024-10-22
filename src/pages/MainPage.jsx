import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CardComponent from "../components/common/CardComponent.jsx";
import DrawerComponent from "../components/common/DrawerComponent.jsx";
import MainSelectComponent from "../components/common/MainSelectComponent.jsx";

const drawerWidth = 240;

export default function MainPage() {
  return (
      <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
            position="fixed"
            sx={{ width: `calc(100% - ${drawerWidth}px)`, mr: `${drawerWidth}px` }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              B셀파
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <MainSelectComponent

          />
          <Typography sx={{ marginBottom: 2, marginTop: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}> {/* flexbox 추가 */}
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </Box>
          </Typography>
          <Typography sx={{ marginBottom: 2, marginTop: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}> {/* flexbox 추가 */}
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </Box>
          </Typography>
          {/*<Typography sx={{ marginBottom: 2 }}>
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
          </Typography>*/}
        </Box>
        <DrawerComponent/>
      </Box>
      </>
  );
}
