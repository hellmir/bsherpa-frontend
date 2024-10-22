import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function MainSelectComponent({outlined='contained'}) {
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
          <Button variant={'outlined'}>국어</Button>
          <Button>수학</Button>
          <Button>영어</Button>
          <Button>과학</Button>
          <Button>사회</Button>
          <Button>역사</Button>
          <Button>도덕</Button>
        </ButtonGroup>
      </Box>
  );
}

export default MainSelectComponent;