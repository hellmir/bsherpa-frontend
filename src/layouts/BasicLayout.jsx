import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import DrawerComponent from "../components/common/DrawerComponent.jsx";

const drawerWidth = 240;

function BasicLayout({children}) {
  return (
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
        {children}
        <DrawerComponent />
      </Box>
  );
}

export default BasicLayout;