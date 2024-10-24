import { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MainSelectComponent from "./common/MainSelectComponent.jsx";
import Typography from "@mui/material/Typography";
import CardComponent from "./common/CardComponent.jsx";
import DrawerComponent from "./common/DrawerComponent.jsx";
import { useParams } from "react-router-dom";

const initState = {
  name: '국어'
}

function MainComponent() {

  const [subject, setSubject] = useState(initState);
  const { subjectName } = useParams();

  useEffect(() => {
    setSubject({ name: subjectName });
  }, [subjectName]);

  return (
      <>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <MainSelectComponent subjectName={subjectName} />

          <Box sx={{ marginBottom: 2, marginTop: 2 }}>
            <Typography variant="h6"> {/* 필요한 텍스트를 여기 추가 */}
              {subject.name} 관련 도서
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CardComponent bookName={`${subject.name}1-1`} bookId={1154} author={'고양이 선생님'} />
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </Box>
          </Box>

          <Box sx={{ marginBottom: 2, marginTop: 2 }}>
            <Typography variant="h6"> {/* 필요한 텍스트를 여기 추가 */}
              추가 도서
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </Box>
          </Box>

         {/* <Box sx={{ marginBottom: 2 }}>
            <Typography variant="h6">  필요한 텍스트를 여기 추가
              추천 도서
            </Typography>
            <CardComponent />
            <CardComponent />
            <CardComponent />
            <CardComponent />
          </Box>*/}
        </Box>

      </>
  );
}

export default MainComponent;
