import {useParams} from "react-router-dom";
import AccordionComponent from "../common/AccordionComponent.jsx";

const data = [
  {largeChapterId:1,largeChapterName:'시험1',exam:'a시험 1회'},
  {largeChapterId:2,largeChapterName:'시험2',exam:'b시험 1회'},
  {largeChapterId:3,largeChapterName:'시험3',exam:'c시험 1회'},
  {largeChapterId:4,largeChapterName:'시험4',exam:'d시험 1회'},
  {largeChapterId:1,largeChapterName:'시험1',exam:'a시험 2회'},
  {largeChapterId:2,largeChapterName:'시험2',exam:'b시험 2회'},
  {largeChapterId:3,largeChapterName:'시험3',exam:'c시험 2회'},
  {largeChapterId:4,largeChapterName:'시험4',exam:'d시험 2회'}

]

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
    const { largeChapterId, largeChapterName,examName,itemCnt } = item;
    if (!acc[largeChapterId]) {
      acc[largeChapterId] = {
        largeChapterId,
        largeChapterName,
        exams: [],
      };
    }
    acc[largeChapterId].exams.push({examName, itemCnt});
    return acc;
  }, {});
};

function Step0Component() {
  const {bookId} = useParams()
  const groupedData = groupByLargeChapterId(examData.examList)
  console.log(groupedData)
  return (
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
  );
}

export default Step0Component;