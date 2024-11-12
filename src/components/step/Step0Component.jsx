import {useLocation} from "react-router-dom";
import AccordionComponent from "../common/AccordionComponent.jsx";
import Button from "@mui/material/Button";
import {Box, CircularProgress} from "@mui/material";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {useDispatch, useSelector} from "react-redux";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {useQuery} from "@tanstack/react-query";
import {getSubjectExamsFromTsherpa} from "../../api/step0Api.js";
import Typography from "@mui/material/Typography";
import HomeIcon from '@mui/icons-material/Home';
import {addBookId} from "../../slices/bookIdSlice.jsx";
import {addExamId, resetExamId} from "../../slices/examIdSlice.jsx";
import {useEffect, useState} from "react";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";

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

  const email = loginState.email;

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



  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useQuery({
    queryKey: [],
    queryFn: () => getSubjectExamsFromTsherpa(book.id),
    enabled: !!email,
    staleTime: Infinity,
  });

  const groupedData = data ? groupByLargeChapterId(data.examList) : [];
  console.log("check groupedData: ",groupedData)

  const handleEditButtonClick = (examId) => {
    moveToStepWithData('step2', examIdList); // Redux에 있는 examIdList를 전달하여 이동
  };

  const renderLargeChapterAccordions = Object.entries(groupedData).map(([id, group]) => (
      <AccordionComponent
          key={id}
          largeChapter={group.largeChapterName}
          exams={group.exams}
          onEditClick={handleEditButtonClick} // 클릭 이벤트를 props로 전달
      />
  ));
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
            {/*<Button variant="contained" onClick={handleClickSelectedExamEdit}>*/}
            {/*  <BorderColorOutlinedIcon /> 선택한 시험지 편집하기*/}
            {/*</Button>*/}
            <Button variant="outlined" sx={{ ml: 1 }} onClick={handleClickNewExamEdit}>
              <AddBoxOutlinedIcon /> 신규 시험지 만들기
            </Button>
          </Box>
        </Box>

          <div>
            <div>
              {renderLargeChapterAccordions}
            </div>
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
