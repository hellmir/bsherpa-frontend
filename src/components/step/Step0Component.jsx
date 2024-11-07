import {useLocation} from "react-router-dom";
import AccordionComponent from "../common/AccordionComponent.jsx";
import Button from "@mui/material/Button";
import {Box, CircularProgress} from "@mui/material";
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
import {getExam} from "../../api/mainApi.js";
import {getQuestionData} from "../../api/step3Api.js";


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

  const {data: userExam, isLoading} = useQuery({
    queryKey: ['email', email],
    queryFn: () => getExam(email),
    enabled: !!email,
    staleTime: Infinity,
    select: (userExam) => {
      // userExam 데이터가 없으면 빈 배열 반환
      if (!userExam) {
        console.error("No userExam data available");
        return [];
      }

      console.log("exExamData: ", userExam);

      // getExamResponses가 없거나 비어 있으면 빈 배열 반환
      if (!userExam.getExamResponses || userExam.getExamResponses.length === 0) {
        console.error("No getExamResponses available");
        return [];
      }
      console.log("CollectionResponse: ", userExam.getExamResponses[0].getCollectionsResponse);
      console.log("PassageResponse: ", userExam.getExamResponses[0].getCollectionsResponse.getCollectionResponses[0].getPassagesResponse.getPassageResponses);
      console.log("QuestionResponse: ", userExam.getExamResponses[0].getCollectionsResponse.getCollectionResponses[0].getQuestionsResponse.getQuestionResponses);
      const structuredExamData = userExam.getExamResponses.map(exam => {
        const collections = exam.getCollectionsResponse.getCollectionResponses.flatMap(collection=>{
          const passages = collection.getPassagesResponse.getPassageResponses.length > 0
              ? collection.getPassagesResponse.getPassageResponses[0]
              : null;
          const questions = collection.getQuestionsResponse.getQuestionResponses.map(q=>{
            return {
              passageId: passages ? passages.passageId : null,
              passageHtml: passages ? passages.html : null,
              passageUrl: passages ? passages.url : null,
              itemid : q.itemId,
              itemNo : q.placementNumber,
              html : q.html,
              answer : q.answer,
              answerUrl : q.answerUrl,
              difficultyCode : q.difficultyCode,
              difficultyName : q.difficulty,
              explainUrl : q.descriptionUrl,
              largeChapterId : q.largeChapterCode,
              largeChapterName : q.largeChapterName,
              mediumChapterId : q.mediumChapterCode,
              mediumChapterName : q.mediumChapterName,
              smallChapterId : q.smallChapterCode,
              smallChapterName : q.smallChapterName,
              topicChapterId : q.topicChapterCode,
              topicChapterName : q.topicChapterName,
              questionFormName : q.questionType,
            };
          })
          return questions;
        })
        return {
          examId : exam.id,
          examName : exam.examName,
          className : exam.className,
          grade : exam.grade,
          subjectName : exam.subjectName,
          itemCnt : exam.size,
          exams : collections,
        }
      });

      console.log("test",structuredExamData);
      return structuredExamData;
    },
  });

  console.log("loading? : ", isLoading);
  console.log("가공된 데이터:", userExam);

  const onClick = false;

  if(onClick) {
  const {data : questionData, } = useQuery({
    queryKey: ['itemIds', itemIds],
    queryFn: () => getQuestionData(itemIds),
    stableTime: 1000*3,
    select : (questionData) => {
      const toStep2Data = questionData.map()

    }
  })
}
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

  const renderContent = () => {
    if (isLoading) {
      return <CircularProgress />;
    }

    const renderLargeChapterAccordions = Object.entries(groupedData).map(([id, group]) => (
        <AccordionComponent
            key={id}
            largeChapter={group.largeChapterName}
            exams={group.exams}
            isUserExamSelected={!!examIdList.length}
        />
    ));

    const renderUserExamAccordion = userExam.length > 0 && (
        <AccordionComponent
            key="userExam"
            largeChapter="내가 만든 시험지"
            exams={userExam}
            isUserExamSelected={!!examIdList.length}
        />
    );
    return (
        <div>
          {renderLargeChapterAccordions}
          {renderUserExamAccordion}
        </div>
    );
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
            <Button variant="contained" onClick={handleClickSelectedExamEdit}>
              <BorderColorOutlinedIcon /> 선택한 시험지 편집하기
            </Button>
            <Button variant="outlined" sx={{ ml: 1 }} onClick={handleClickNewExamEdit}>
              <AddBoxOutlinedIcon /> 신규 시험지 만들기
            </Button>
          </Box>
        </Box>

          <div>
            {isLoading ? (
                  <CircularProgress/>
                ) : (
                <div>
                  {renderContent()}
                </div>
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
