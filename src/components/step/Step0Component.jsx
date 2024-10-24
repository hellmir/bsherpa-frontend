import {useParams} from "react-router-dom";
import AccordionComponent from "../common/AccordionComponent.jsx";
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import {useSelector} from "react-redux";
import useCustomMove from "../../hooks/useCustomMove.jsx";

const examData = {
  "examList": [
    {
      "largeChapterId": 115401,
      "largeChapterName": "1. 새로운 시작",
      "examId": 236,
      "examName": "중_국어 1-1(노)_1-1_단원평가_1회_T셀파",
      "itemCnt": 23
    },
    {
      "largeChapterId": 115402,
      "largeChapterName": "2. 세상과 함께 자라는 꿈",
      "examId": 523,
      "examName": "중_국어 1-1(노)_2-1_단원평가_1회_T셀파",
      "itemCnt": 22
    },
    {
      "largeChapterId": 115403,
      "largeChapterName": "3. 언어랑 국어랑 놀자",
      "examId": 866,
      "examName": "중_국어 1-1(노)_3-1_단원평가_1회_T셀파",
      "itemCnt": 23
    },
    {
      "largeChapterId": 115404,
      "largeChapterName": "4. 더불어 살아가기",
      "examId": 919,
      "examName": "중_국어 1-1(노)_4-1_단원평가_1회_T셀파",
      "itemCnt": 24
    },
    {
      "largeChapterId": 115401,
      "largeChapterName": "1. 새로운 시작",
      "examId": 238,
      "examName": "중_국어 1-1(노)_1-1_단원평가_2회_T셀파",
      "itemCnt": 27
    },
    {
      "largeChapterId": 115402,
      "largeChapterName": "2. 세상과 함께 자라는 꿈",
      "examId": 719,
      "examName": "중_국어 1-1(노)_2-1_단원평가_2회_T셀파",
      "itemCnt": 25
    },
    {
      "largeChapterId": 115403,
      "largeChapterName": "3. 언어랑 국어랑 놀자",
      "examId": 873,
      "examName": "중_국어 1-1(노)_3-1_단원평가_2회_T셀파",
      "itemCnt": 23
    },
    {
      "largeChapterId": 115404,
      "largeChapterName": "4. 더불어 살아가기",
      "examId": 931,
      "examName": "중_국어 1-1(노)_4-1_단원평가_2회_T셀파",
      "itemCnt": 23
    },
    {
      "largeChapterId": 115401,
      "largeChapterName": "1. 새로운 시작",
      "examId": 273,
      "examName": "중_국어 1-1(노)_1-1_단원평가_3회_T셀파",
      "itemCnt": 21
    },
    {
      "largeChapterId": 115402,
      "largeChapterName": "2. 세상과 함께 자라는 꿈",
      "examId": 831,
      "examName": "중_국어 1-1(노)_2-1_단원평가_3회_T셀파",
      "itemCnt": 17
    },
    {
      "largeChapterId": 115403,
      "largeChapterName": "3. 언어랑 국어랑 놀자",
      "examId": 882,
      "examName": "중_국어 1-1(노)_3-1_단원평가_3회_T셀파",
      "itemCnt": 19
    },
    {
      "largeChapterId": 115404,
      "largeChapterName": "4. 더불어 살아가기",
      "examId": 940,
      "examName": "중_국어 1-1(노)_4-1_단원평가_3회_T셀파",
      "itemCnt": 16
    },
    {
      "largeChapterId": 115401,
      "largeChapterName": "1. 새로운 시작",
      "examId": 400,
      "examName": "중_국어 1-1(노)_1-2_단원평가_1회_T셀파",
      "itemCnt": 23
    },
    {
      "largeChapterId": 115402,
      "largeChapterName": "2. 세상과 함께 자라는 꿈",
      "examId": 841,
      "examName": "중_국어 1-1(노)_2-2_단원평가_1회_T셀파",
      "itemCnt": 25
    },
    {
      "largeChapterId": 115403,
      "largeChapterName": "3. 언어랑 국어랑 놀자",
      "examId": 893,
      "examName": "중_국어 1-1(노)_3-2_단원평가_1회_T셀파",
      "itemCnt": 26
    },
    {
      "largeChapterId": 115404,
      "largeChapterName": "4. 더불어 살아가기",
      "examId": 1116,
      "examName": "중_국어 1-1(노)_4-2_단원평가_1회_T셀파",
      "itemCnt": 24
    },
    {
      "largeChapterId": 115401,
      "largeChapterName": "1. 새로운 시작",
      "examId": 425,
      "examName": "중_국어 1-1(노)_1-2_단원평가_2회_T셀파",
      "itemCnt": 23
    },
    {
      "largeChapterId": 115402,
      "largeChapterName": "2. 세상과 함께 자라는 꿈",
      "examId": 851,
      "examName": "중_국어 1-1(노)_2-2_단원평가_2회_T셀파",
      "itemCnt": 26
    },
    {
      "largeChapterId": 115403,
      "largeChapterName": "3. 언어랑 국어랑 놀자",
      "examId": 899,
      "examName": "중_국어 1-1(노)_3-2_단원평가_2회_T셀파",
      "itemCnt": 27
    },
    {
      "largeChapterId": 115404,
      "largeChapterName": "4. 더불어 살아가기",
      "examId": 1132,
      "examName": "중_국어 1-1(노)_4-2_단원평가_2회_T셀파",
      "itemCnt": 23
    },
    {
      "largeChapterId": 115401,
      "largeChapterName": "1. 새로운 시작",
      "examId": 437,
      "examName": "중_국어 1-1(노)_1-2_단원평가_3회_T셀파",
      "itemCnt": 20
    },
    {
      "largeChapterId": 115402,
      "largeChapterName": "2. 세상과 함께 자라는 꿈",
      "examId": 855,
      "examName": "중_국어 1-1(노)_2-2_단원평가_3회_T셀파",
      "itemCnt": 18
    },
    {
      "largeChapterId": 115403,
      "largeChapterName": "3. 언어랑 국어랑 놀자",
      "examId": 904,
      "examName": "중_국어 1-1(노)_3-2_단원평가_3회_T셀파",
      "itemCnt": 23
    },
    {
      "largeChapterId": 115404,
      "largeChapterName": "4. 더불어 살아가기",
      "examId": 1153,
      "examName": "중_국어 1-1(노)_4-2_단원평가_3회_T셀파",
      "itemCnt": 19
    },
    {
      "largeChapterId": 115401,
      "largeChapterName": "1. 새로운 시작",
      "examId": 452,
      "examName": "중_국어 1-1(노)_1-선택 학습 1_단원평가_1회_T셀파",
      "itemCnt": 2
    },
    {
      "largeChapterId": 115402,
      "largeChapterName": "2. 세상과 함께 자라는 꿈",
      "examId": 861,
      "examName": "중_국어 1-1(노)_2-선택 학습 1_단원평가_1회_T셀파",
      "itemCnt": 1
    },
    {
      "largeChapterId": 115404,
      "largeChapterName": "4. 더불어 살아가기",
      "examId": 1164,
      "examName": "중_국어 1-1(노)_4-선택 학습 1_T셀파",
      "itemCnt": 4
    },
    {
      "largeChapterId": 115401,
      "largeChapterName": "1. 새로운 시작",
      "examId": 458,
      "examName": "중_국어 1-1(노)_1-선택 학습 2_단원평가_1회_T셀파",
      "itemCnt": 5
    }
  ],
  "successYn": "Y"
}

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
  const {bookId} = useParams()
  const {moveToStepWithData} = useCustomMove()
  const groupedData = groupByLargeChapterId(examData.examList)
  const examIdList = useSelector(state => state.examIdSlice)
  console.log(groupedData)

  const handleClickSelectedExamEdit = () =>{
    console.log(`선택한 시험지 만들기 : ${examIdList}`)
    moveToStepWithData('step1',examIdList)
  }
  const handleClickNewExamEdit = () =>{
    console.log(`새로운 시험지 만들기 : ${bookId}`)
    moveToStepWithData('step1',bookId)
  }

  return (
      <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button
            variant="contained"
            onClick={handleClickSelectedExamEdit}
        ><BorderColorOutlinedIcon/>선택한 시험지 편집하기</Button>
        <Button
            variant="outlined"
            sx={{ ml: 1 }}
            onClick={handleClickNewExamEdit}
        ><AddBoxOutlinedIcon/>신규 시험지 만들기</Button>
      </Box>
  <div>
        bookId:{bookId}
        {Object.entries(groupedData).map(([id,group])=>(
          <AccordionComponent
            key={id}
          largeChapter={group.largeChapterName}
        exams={group.exams}
      />
        ))

        }

      </div>
      </>
  );
}

export default Step0Component;