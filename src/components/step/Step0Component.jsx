import {useLocation} from "react-router-dom";
import AccordionComponent from "../common/AccordionComponent.jsx";
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {useDispatch, useSelector} from "react-redux";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {useQuery} from "@tanstack/react-query";
import {getSubjectExamsFromTsherpa} from "../../api/step0Api.js";
import Typography from "@mui/material/Typography";
import HomeIcon from '@mui/icons-material/Home';
import {addBookId} from "../../slices/bookIdSlice.jsx";
import {resetExamId} from "../../slices/examIdSlice.jsx";
import {useEffect, useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import jwtAxios from '../../util/jwtUtil.jsx';


const groupByLargeChapterId = (array) => {
  return array.reduce((acc, item) => {
    const { largeChapterId, largeChapterName, examName, itemCnt, examId } = item;
    if (!acc[largeChapterId]) {
      acc[largeChapterId] = {
        largeChapterId,
        largeChapterName,
        exams: [],
      };
    }
    acc[largeChapterId].exams.push({ examName, itemCnt, examId });
    return acc;
  }, {});
};

function Step0Component() {

  const dispatch = useDispatch();
  const { moveToStepWithData, moveToPath, moveToMainReturn } = useCustomMove();
  const examIdList = useSelector(state => state.examIdSlice);
  const location = useLocation()
  const {doLogin,doLogout,isLogin,loginState} = useCustomLogin();
  const [examList ,setExamList] = useState([]);

  if (location.state===null){
    return moveToMainReturn()
  }

  const book = location.state.data;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const isReloaded = sessionStorage.getItem("isReloaded");
    if (!isReloaded) {
      sessionStorage.setItem("isReloaded", "true");
      window.location.reload();
    }
    const localData = localStorage.getItem("mytodolist");
    console.log(localData)
    return () => {
      console.log(sessionStorage.removeItem("isReloaded"))
      sessionStorage.removeItem("isReloaded");
    };
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    dispatch(addBookId(book.id)); // Book ID를 추가
  }, [dispatch, book.id]); // 의존성 배열에 추가


 // 나의 시험지 목록 가져오기
  useEffect(() => {
  jwtAxios.get(`https://bsherpa.duckdns.org/exams/storage?email=${loginState.email}`)
      .then((response) => {
        console.log('이메일으로 받아오기 성공')
          setExamList(response.data.getExamResponses)
          console.log(examList)
          console.log(response.data)
      })
      .catch((error) => {
        console.error('Error :', error);
      })
}, [loginState.email]); 
useEffect(() => {
  console.log('examList 받아오기 성공')
  console.log(examList)
});


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useQuery({
    queryKey: [],
    queryFn: () => getSubjectExamsFromTsherpa(book.id),
    staleTime: 1000 * 3,
  });

  const groupedData = data ? groupByLargeChapterId(data.examList) : [];
  
  console.log(groupedData)
  const handleClickSelectedExamEdit = () => {
    moveToStepWithData('step2', examIdList);
  };

  const handleClickNewExamEdit = () => {
    moveToStepWithData('step1', book.id);
  };

  const handleClickHome = () => {
    dispatch(resetExamId());

    moveToPath('/');
  };
  console.log(loginState.email)

  return (
      <>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'primary.main', display: 'inline' }}>
              {book.name}
            </Typography>
            <Typography variant="h5" sx={{ color: 'black', display: 'inline' }}>
              ({book.author})
            </Typography>
          </Box>
          <Box>
            <Button variant="contained" onClick={handleClickSelectedExamEdit}>
              <BorderColorOutlinedIcon /> 선택한 시험지 편집하기
            </Button>
            <Button variant="outlined" sx={{ ml: 1 }} onClick={handleClickNewExamEdit}>
              <AddBoxOutlinedIcon /> 신규 시험지 만들기
            </Button>
          </Box>
        </Box>

        <div>
          {groupedData ? (
              Object.entries(groupedData).map(([id, group]) => (
                  <AccordionComponent
                      key={id}
                      largeChapter={group.largeChapterName}
                      exams={group.exams}
                  />
              ))
          ) : (
              <Typography variant="body1">관련 문제가 없습니다.</Typography>
          )}
           {/* 수정된 examList 렌더링 부분 */}
           {Array.isArray(examList) && examList.length > 0 ? (
          examList.map((exam) => (
            <AccordionComponent
              key={exam.id}
              largeChapter={exam.username}
              exams={exam.exams || []} // exam.exams가 없을 경우 빈 배열 사용
            />
          ))
        ) : (
          <Typography variant="body1">저장된 시험지가 없습니다.</Typography>
        )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button variant={'outlined'} onClick={handleClickHome}>
              <HomeIcon />홈
            </Button>
          </Box>
        </div>
      </>
  );
}

export default Step0Component;
