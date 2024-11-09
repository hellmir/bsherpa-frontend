import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import CommonResource from "../../util/CommonResource.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getBookData, getQuestionData, registerExam} from "../../api/step3Api.js";
import {useQuery} from "@tanstack/react-query";
import {setExamData} from "../../slices/examDataSlice.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import Button from "@mui/material/Button";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import ModalComponent from "../common/ModalComponent.jsx";
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";
import Step3SuccessComponent from "./Step3SuccessComponent.jsx";
import HomeIcon from '@mui/icons-material/Home';

export default function Step3Component() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    useEffect(() => {
        console.log('bookId', bookId);
        if (!bookId) {
            setIsAccessModalOpen(true);
        }
    }, []);


    useEffect(() => {
        // 방법 1: zoom 속성 사용
        document.body.style.zoom = "125%";  // 75% 크기로 축소
        // 또는 방법 2: transform scale 사용
        document.body.style.transform = "scale(0.75)";
        document.body.style.transformOrigin = "top ";
        return () => {
          // 컴포넌트 언마운트 시 원래대로 복구
          document.body.style.zoom = "100%";
          // 또는
          document.body.style.transform = "none";
        };
      }, []);

    const {moveToPath} = useCustomMove();
    const handleCloseAccessModal = () => {
        setIsShiftModalOpen(false);
        moveToPath('/');
    };

    //const [itemList, setItemList] = useState([]);
    const { bookId, totalQuestions, groupedItems, step1Data } = useSelector((state) => state.examDataSlice);
    console.log('Step2로부터 전송된 bookId:', bookId);
    console.log('Step2로부터 전송된 문제 수:', totalQuestions);
    console.log('Step2로부터 전송된 지문과 문제 데이터 목록: ', groupedItems);
    console.log('Step2로부터 전송된 Step1 데이터 ', step1Data);

    const loginState = useSelector(state => state.loginSlice)
    const email = loginState.email;
    console.log('loginYn: ',loginState);
    console.log(email)

    // 시험명 추가용 로직
    const [examName, setExamName] = useState("");
    const regExp = /[\/?:|*+<>\;\"#%\\]/gi;


    // 배치순서 부여 (groupedItem의 itemNo가 초기화되면서 itemNo가 순서대로 바뀜)
    let globalIndex = 1; //컴포넌트 범위에서 초기화
    const updatedGroupedItems = groupedItems.map(group => {
        return {
            ...group,
            items: group.items.map(item => ({
                ...item, // 기존 item의 속성을 복사
                placementNumber: globalIndex++ // placementNumber 추가
            }))
        };
    });

    const itemIds = updatedGroupedItems.flatMap(group =>
        Array.isArray(group.items) ? group.items.map(item => item.itemId) : []
    );
    console.log("check itemIds : ", itemIds)

    const {data: questionData} = useQuery({
        queryKey: ['itemIds', itemIds],
        queryFn: () => getQuestionData(itemIds),
        staleTime: 1000 * 3,
        enabled: !!itemIds.length
    });

    console.log("questionData : ", questionData)

    const {data: bookData, isLoading: isBookDataLoading} = useQuery({
        queryKey: ['subjectId', bookId],
        queryFn: () => getBookData(bookId),
        staleTime: 1000*3,
        enabled: !!bookId
    });
    console.log("bookData: ", bookData)


    const totalCount = updatedGroupedItems.reduce((count, group) => {
        return count + group.items.length; // 각 그룹의 질문 개수를 더함
    }, 0);

    console.log("totalCount: ",totalCount)
    console.log("count: ", itemIds.length)

    const [isSuccess, setIsSuccess] = useState(false);
    const handleSaveExam = async () => {
        //questionData와 updatedGroupedItems를 병합
        const questionDataMap = {};
        const passageMap = {};

        if (!examName) {
            alert("시험지명을 입력해 주세요.");
            return;
        }

        if (questionData && Array.isArray(questionData.itemList)) {
            questionData.itemList.forEach(question => {
                questionDataMap[question.itemId] = question; // itemId를 키로 하는 객체

                if (question.passageId) {
                    passageMap[question.passageId] = question.passageHtml; // passageId를 키로 하고 HTML 데이터를 저장
                }
            });
        }

        const exam = {
            email : email,
            bookId : bookId.toString(),
            examName : examName,
            totalCount : totalCount,
            examCategory : "custom",
            collections: updatedGroupedItems.map(group=> ({
                questions: group.items.map(item=> {
                    const questionDetails = questionData && Array.isArray(questionData.itemList)
                        ? questionData.itemList.find(q => q.itemId === item.itemId) || {}
                        : {};
                    const options = [];

                    for (let i = 1; i<=5; i++){
                        const choiceHtml = questionDetails[`choice${i}Html`];
                        if (choiceHtml) {
                            options.push({
                                optionNo: i,
                                answerYn: questionDetails.answer === choiceHtml || questionDetails.answer === i.toString(),
                                html: choiceHtml
                            });
                        }
                    }
                    return{
                        itemId: item.itemId,
                        questionType: item.questionFormCode,
                        url: item.questionUrl,
                        answerUrl: item.answerUrl,
                        difficulty: item.difficultyCode,
                        descriptionUrl: item.explainUrl,
                        largeChapterName: item.largeChapterName,
                        largeChapterCode: item.largeChapterId,
                        mediumChapterName: item.mediumChapterName,
                        mediumChapterCode: item.mediumChapterId,
                        smallChapterName: item.smallChapterName,
                        smallChapterCode: item.smallChapterId,
                        topicChapterName: item.topicChapterName,
                        topicChapterCode: item.topicChapterId,
                        placementNumber: item.placementNumber,
                        // 병합되는 data
                        answer: questionDetails.answer,
                        answerHtml: questionDetails.answerHtml,
                        descriptionHtml: questionDetails.explainHtml,
                        html: questionDetails.questionHtml,
                        options: options.length > 0 ? options : []
                        };
                }),
                passages: group.passageId ? [{
                    passageId: group.passageId,
                    url: group.passageUrl,
                    html: passageMap[group.passageId] || "", // passageMap에서 해당 passageId의 HTML 데이터를 가져옴
                }] : []
            }))
        }
        console.log("exam data: ",exam);
        setLoading(true);
        setModalOpen(true);
        setIsSuccess(false);
        try{
            const response = await registerExam(exam);
            if(response.status === 200) {
                setLoading(false);
                setModalOpen(false);
                setIsSuccess(true);
                console.log("response",response)
            } else {
                alert("저장에 실패했습니다.");
                setLoading(false);
            }
        }catch(error){
            alert("오류가 발생했습니다. 메인 화면으로 돌아갑니다.")
            moveToPath('/');
        }finally{
            setLoading(false);
        }
    }
    console.log("updateItems: ",updatedGroupedItems);

    const handleExamNameChange = (e) => {
        const inputValue = e.target.value;
        if (regExp.test(inputValue)) {
            alert("시험지명에 사용할 수 없는 문자가 포함되어 있습니다.");
            setExamName(inputValue.replace(regExp, "")); // 불허된 문자를 제거한 값으로 설정
        } else {
            setExamName(inputValue);
        }
    };
    const {moveToStepWithData} = useCustomMove();

    const handleClickMoveToStepOne = () => {
        moveToStepWithData('step1', bookId);
    }
    const handleClickMoveToStepTwo = () => {
        dispatch(setExamData({bookId, totalQuestions, groupedItems, step1Data}))
        moveToStepWithData('step2', step1Data);
    };

    const handleClickHome = () => {
    
        moveToPath('/');
      };


    return (
        
        <div className="view-box" style={{ border: '2px solid #1976d2',
            width: '95%',  // 또는 'px' 단위로 직접 지정
            height: '730px',
            margin: 'auto',
              // 가운데 정렬을 위해
         }}>
            <ModalComponent
                title="비정상적인 접근"
                content={
                    <>비정상적인 접근이 감지되었습니다.<br/>
                        메인 페이지로 이동합니다.</>
                }
                handleClose={handleCloseAccessModal}
                open={isAccessModalOpen}
            />
          <Button 
          variant={'outlined'} 
          onClick={handleClickHome}
          style={{
            position: 'absolute',
            top: '25px',
            right: '35px'
          }}
        >
                <HomeIcon />홈
              </Button>
            <CommonResource />
            {isSuccess ? (
                <Step3SuccessComponent />
            ) : (
                <>
            <div className="view-top">
                <div className="paper-info">
                    {isBookDataLoading ? (
                        <CircularProgress />
                    ) : (
                        <span>{bookData?.subjectInfoList?.[0]?.subjectName}</span>
                    )}
                </div>
                <div className="btn-wrap">
                   
                </div>
            </div>
            <div className="view-bottom type02 scroll-inner">

                <div className="top-form">
                    <div className="left-wrap">
                        <span>시험지명</span>
                        <div className="search-wrap">
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="시험지명을 입력해주세요. (최대 20자)"
                                    className="search"
                                    value={examName}
                                    onChange={handleExamNameChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-list-type01">
                    <div className="table">
                        <div className="fix-head">
                            <span>번호</span>
                            <span>문제 유형</span>
                            <span>문제 형태</span>
                            <span>난이도</span>
                        </div>
                        <div className="tbody">
                            <div className="scroll-inner">
                                {updatedGroupedItems.map(group =>
                                    group.items.map(item => (
                                        <div className="col" key={item.itemId}>
                                            <span>{item.placementNumber}</span>
                                            <span className="tit">
                                                {item.largeChapterName}
                                                &gt;{item.mediumChapterName}
                                                &gt;{item.smallChapterName}
                                                &gt;{item.topicChapterName}
                                            </span>
                                            <span>{item.questionFormName}</span>
                                            <span>{item.difficultyName}</span>
                                            <span> </span>
                                        </div>
                                    ))
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="step-btn-wrap">
                <Button
                    variant="contained"
                    onClick={handleClickMoveToStepTwo}
                    className="btn-step"
                >
                    <BorderColorOutlinedIcon/> STEP 2 문항 편집
                </Button>
                <Button variant="contained"
                        className="btn-step next done"
                        onClick={handleSaveExam}
                >시험지 저장하기
                </Button>
            </div>
            <ModalComponent
                title={loading ? "저장 중" : isSuccess ? "저장 완료" : "오류 발생"}
                content={loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <CircularProgress />
                    </Box>
                    ) : isSuccess ? (
                        <Step3SuccessComponent/>
                    ) : (
                        <span>저장 실패!</span>
                    )
                }
                handleClose={() => setModalOpen(false)}
                open={modalOpen}
                isLoading={loading}
            />
                </>
            )}
        </div>

    )
}
