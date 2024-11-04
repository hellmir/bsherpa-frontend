import {useState} from 'react';
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import {
  Box,
  Button,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {validator} from "../../util/validator.js";
import ModalComponent from "../common/ModalComponent.jsx";
import {useLocation} from "react-router-dom";
import {postJoin} from "../../api/userApi.js";

const initState = {
  email: '',
  username: '',
  password: '',
  role: 'CREATOR',
  class:'',
  grade: ''
};

function JoinComponent() {
  const [user, setUser] = useState(initState);
  const { moveToPath, moveToMainReturn } = useCustomMove();
  const [result, setResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [alignment, setAlignment] = useState(initState.role);
  const [studentType, setStudentType] = useState('');
  const [grade, setGrade] = useState('');
  const stateData = useLocation().state;

  if (!stateData) {
    return moveToMainReturn();
  }

  const email = stateData.data

  const handleChange = (e) => {
    user[e.target.name] = e.target.value
    user.email =email
    setUser({...user})
  }
  const handleClickJoin = () => {
    const validatorResult = validator('join', user);
    if (!validatorResult.isValid) {
      setResult(validatorResult.errors);
      setOpen(true);
      return;
    }
    if(user.role === 'STUDENT'){
    user.class = studentType
    user.grade = grade
    }
    if (user.role !== 'STUDENT'){
      user.class = ''
      user.grade = ''
    }
    postJoin(user)
    .then(data => {
      if (data.SUCCESS === 'JOIN') {
        moveToPath('/');
      }
    })
    .catch(err => {
      console.error('가입 에러', err);
    });
  };

  const handleClickCloseModal = () => {
    setOpen(false);
    setResult(null);
  };

  const handleChangeRole = (e, newAlignment) => {
    setAlignment(newAlignment);
    user.role = newAlignment
  };

  const handleStudentTypeChange = (event) => {
    setStudentType(event.target.value);
    setGrade(''); // Reset the grade when changing the type
  };

  return (
      <>
        {result && (
            <ModalComponent
                title={'잘못된 입력입니다'}
                content={result}
                handleClose={handleClickCloseModal}
                open={open}
            />
        )}
        <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: 'background.default',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh'
            }}
        >
          <Box sx={{ width: '300px' }}>
            <Stack spacing={2}>
              <ToggleButtonGroup
                  color="primary"
                  value={alignment}
                  exclusive
                  onChange={handleChangeRole}
                  aria-label="Platform"
              >
                <ToggleButton value="CREATOR">출제자</ToggleButton>
                <ToggleButton value="STUDENT">출제+문제풀이</ToggleButton>
              </ToggleButtonGroup>

              <TextFieldComponent
                  id={'joinEmail'}
                  name={'email'}
                  type={'email'}
                  label={'이메일'}
                  value={email}
                  handleChange={handleChange}
                  disabled={true}
              />
              <TextFieldComponent
                  auto={false}
                  id={'joinUsername'}
                  name={'username'}
                  type={'text'}
                  label={'유저명'}
                  value={user.username}
                  handleChange={handleChange}
              />
              <TextFieldComponent
                  auto={false}
                  id={'joinPassword'}
                  name={'password'}
                  type={'password'}
                  label={'비밀번호'}
                  value={user.password}
                  handleChange={handleChange}
              />

              {alignment === 'STUDENT' && (
                  <>
                    <RadioGroup
                        row
                        value={studentType}
                        onChange={handleStudentTypeChange}
                        aria-labelledby="student-type-group-label"
                        name="grade"
                    >
                      <FormControlLabel value="elementary" control={<Radio />} label="초등학생" />
                      <FormControlLabel value="middle" control={<Radio />} label="중학생" />
                      <FormControlLabel value="high" control={<Radio />} label="고등학생" />
                    </RadioGroup>

                    {studentType === 'elementary' && (
                        <Select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            displayEmpty
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                          <MenuItem value="" disabled>학년을 선택하세요</MenuItem>
                          <MenuItem value="1">1학년</MenuItem>
                          <MenuItem value="2">2학년</MenuItem>
                          <MenuItem value="3">3학년</MenuItem>
                          <MenuItem value="4">4학년</MenuItem>
                          <MenuItem value="5">5학년</MenuItem>
                          <MenuItem value="6">6학년</MenuItem>
                        </Select>
                    )}{studentType === 'middle' && (
                        <Select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            displayEmpty
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                          <MenuItem value="" disabled>학년을 선택하세요</MenuItem>
                          <MenuItem value="1">1학년</MenuItem>
                          <MenuItem value="2">2학년</MenuItem>
                          <MenuItem value="3">3학년</MenuItem>
                        </Select>
                    )}{studentType === 'high' && (
                        <Select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            displayEmpty
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                          <MenuItem value="" disabled>학년을 선택하세요</MenuItem>
                          <MenuItem value="1">1학년</MenuItem>
                          <MenuItem value="2">2학년</MenuItem>
                          <MenuItem value="3">3학년</MenuItem>
                        </Select>
                    )}
                  </>
              )}

              <Button
                  variant="contained"
                  onClick={handleClickJoin}
                  fullWidth
              >
                회원가입
              </Button>
            </Stack>
          </Box>
        </Box>
      </>
  );
}

export default JoinComponent;
