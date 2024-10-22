import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import useCustomMove from "../../hooks/useCustomMove.jsx";

function MainSelectComponent({subjectName,outlined='contained'}) {

  const {moveToPath} = useCustomMove()

  const handleClickSubject = (e) => {
    console.log(e.target.textContent)
    const path = e.target.textContent
    moveToPath(`/${path}`)
  }

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
          <Button
              variant={outlined}
          >중학</Button>
          <Button>시험지 보관함</Button>
        </ButtonGroup>
        <ButtonGroup variant="text" aria-label="Basic button group">
          {subjectName === '국어' ?
              <Button
                  variant={'outlined'}
                  onClick={handleClickSubject}
              >국어</Button>
              :
              <Button
                  onClick={handleClickSubject}
              >국어</Button>
          }
          {subjectName === '수학' ?
              <Button
                  variant={'outlined'}
                  onClick={handleClickSubject}
              >수학</Button>
              :
              <Button
                  onClick={handleClickSubject}
              >수학</Button>
          }
          {subjectName === '영어' ?
              <Button
                  variant={'outlined'}
                  onClick={handleClickSubject}
              >영어</Button>
              :
              <Button
                  onClick={handleClickSubject}
              >영어</Button>
          }

          <Button
              onClick={handleClickSubject}
          >과학</Button>
          <Button
              onClick={handleClickSubject}
          >사회</Button>
          <Button
              onClick={handleClickSubject}
          >역사</Button>
          <Button
              onClick={handleClickSubject}
          >도덕</Button>
        </ButtonGroup>
      </Box>
  );
}

export default MainSelectComponent;