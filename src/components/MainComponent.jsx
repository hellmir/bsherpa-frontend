import React from 'react';
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MainSelectComponent from "./common/MainSelectComponent.jsx";
import Typography from "@mui/material/Typography";
import CardComponent from "./common/CardComponent.jsx";
import DrawerComponent from "./common/DrawerComponent.jsx";

function MainComponent(props) {
  return (
      <>
      <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <MainSelectComponent

        />
        <Typography sx={{ marginBottom: 2, marginTop: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}> {/* flexbox 추가 */}
            <CardComponent
            bookName={'국어1-1'}
            bookId={1154}
            author={'고양이 선생님'}
            />
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
      </>
  );
}

export default MainComponent;