import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import ModalComponent from "./ModalComponent.jsx";
import  {useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";

function MainSelectComponent({ subjectName, outlined = 'contained' }) {
  const { moveToPathWithData } = useCustomMove();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const {isLogin} = useCustomLogin();
  const handleClickSubject = (e) => {
    const selectSubjectName = e.target.textContent;
    console.log(selectSubjectName)
    moveToPathWithData(`/`,selectSubjectName);
  };
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
};
const handleClickExamStorage = () => {
  if (!isLogin) {
    setIsLoginModalOpen(true);
  } else {
    moveToPathWithData('/exam/storage');
  }
};

  const subjects = ['국어', '수학', '영어', '과학', '사회', '역사', '도덕'];

  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > *': {
              m: 1,
            },
          }}
      >
        <ButtonGroup variant="outlined" aria-label="Basic button group">
          <Button variant={outlined}>중학</Button>
          <Button onClick={handleClickExamStorage}>
      
            
            시험지 보관함</Button>
        </ButtonGroup>
        <ButtonGroup variant="text" aria-label="Basic button group">
          {subjects.map((subject) => (
              <Button
                  key={subject}
                  variant={subjectName === subject ? 'outlined' : 'text'}
                  onClick={handleClickSubject}
              >
                {subject}
              </Button>
          ))}
        </ButtonGroup>
        <ModalComponent
          title="로그인 정보 없음"
          content={
              <>로그인 후 이용해 주세요</>
          }
          handleClose={handleCloseLoginModal}
          open={isLoginModalOpen}
          />
      </Box>
  );
}

export default MainSelectComponent;
