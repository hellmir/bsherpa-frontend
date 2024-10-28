import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useCustomMove from "../../hooks/useCustomMove.jsx";

function MainSelectComponent({ subjectName, outlined = 'contained' }) {
  const { moveToPathWithData } = useCustomMove();

  const handleClickSubject = (e) => {
    const selectSubjectName = e.target.textContent;
    console.log(selectSubjectName)
    moveToPathWithData(`/`,selectSubjectName);
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
          <Button>시험지 보관함</Button>
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
      </Box>
  );
}

export default MainSelectComponent;
