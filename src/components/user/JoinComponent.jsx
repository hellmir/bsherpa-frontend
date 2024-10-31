import {useState} from 'react';
import TextFieldComponent from "../common/TextFieldComponent.jsx";
import {Box, Stack} from "@mui/material";
import Button from "@mui/material/Button";
import {postJoin} from "../../api/userApi.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {validator} from "../../util/validator.js";
import ModalComponent from "../common/ModalComponent.jsx";
import {useLocation} from "react-router-dom";

const initState = {
  email: '',
  username: '',
  password: ''
}

function JoinComponent() {

  const [user, setUser] = useState(initState)
  const {moveToPath, moveToMainReturn} = useCustomMove()
  const [result, setResult] = useState(null)
  const [open, setOpen] = useState(false)
  if(!useLocation().state){
    return moveToMainReturn()
  }

  const email = useLocation().state.data

  const handleChange = (e) => {
    user[e.target.name] = e.target.value
    user.email =email
    setUser({...user})
  }

  const handleClickJoin = () => {
    const validatorResult = validator('join',user)
    if (!validatorResult.isValid){
      setResult(validatorResult.errors)
      setOpen(true)
      return
    }
    postJoin(user).then(data => {
      console.log(`가입 성공: `)
      console.log(data)
      if (data.SUCCESS === 'JOIN') {
        moveToPath('/')
      }
    }).catch(err => {
      console.log('가입 에러', err)
    })
  }

  const handleClickCloseModal = () => {
    setOpen(false)
    setResult(null)
  }

  return (
      <>{result?
        <ModalComponent
        title={'잘못된 입력입니다'}
        content={result}
        handleClose={handleClickCloseModal}
        open={open}
        />
        :
          <></>
      }
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
        <Box sx={{width: '300px'}}>
          <Stack spacing={2}>
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
            <Button
                variant="contained"
                onClick={handleClickJoin}
                fullWidth>회원가입</Button>
          </Stack>
        </Box>
      </Box>
      </>
  );
}

export default JoinComponent;
