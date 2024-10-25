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

const groupByLargeChapterId = (array) => {
  return array.reduce((acc, item) => {
    const { largeChapterId, largeChapterName,examName,itemCnt,examId } = item;
    if (!acc[largeChapterId]) {
      acc[largeChapterId] = {
        largeChapterId,
        largeChapterName,
        exams: [],
      };
    }
    acc[largeChapterId].exams.push({examName, itemCnt,examId});
    return acc;
  }, {});
};


function Step0Component() {
  const book = useLocation().state.data
  const dispatch = useDispatch()
  dispatch(addBookId(book.id))
  const {moveToStepWithData,moveToPath} = useCustomMove()

  const examIdList = useSelector(state => state.examIdSlice)


  const {data} = useQuery({
    queryKey:[],
    queryFn:()=>getSubjectExamsFromTsherpa(book.id),
    staleTime:1000*3
  })
  console.log(data)
    const groupedData = data? groupByLargeChapterId(data.examList) : []

  console.log(groupedData)
  const handleClickSelectedExamEdit = () =>{
    console.log(`선택한 시험지 만들기 : ${examIdList}`)
    moveToStepWithData('step1',examIdList)
  }
  const handleClickNewExamEdit = () =>{
    console.log(`새로운 시험지 만들기 : ${book.id}`)
    moveToStepWithData('step1',book.id)
  }

  const handleClickHome = () => {
    moveToPath('/')
  }

  return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="body1"><h1>{book.name} ({book.author})</h1></Typography>
          <Box>
            <Button
                variant="contained"
                onClick={handleClickSelectedExamEdit}
            >
              <BorderColorOutlinedIcon /> 선택한 시험지 편집하기
            </Button>
            <Button
                variant="outlined"
                sx={{ ml: 1 }}
                onClick={handleClickNewExamEdit}
            >
              <AddBoxOutlinedIcon /> 신규 시험지 만들기
            </Button>
          </Box>
        </Box>
  <div>
        {groupedData?(Object.entries(groupedData).map(([id,group])=>(
          <AccordionComponent
            key={id}
          largeChapter={group.largeChapterName}
        exams={group.exams}
      />
        )))
          :
            (<Typography variant="body1"> 관련 문제가 없습니다.</Typography>)
        }
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button
        variant={'outlined'}
        onClick={handleClickHome}
        ><HomeIcon/>홈</Button>
    </Box>
      </div>
      </>
  );
}

export default Step0Component;