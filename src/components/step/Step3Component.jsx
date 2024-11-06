import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import CommonResource from "../../util/CommonResource.jsx";
import {useSelector} from "react-redux";
import {getQuestionData, registerExam} from "../../api/step3Api.js";
import {useQuery} from "@tanstack/react-query";
import ModalComponent from "../common/ModalComponent.jsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";
export default function Step3Component() {

    const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    useEffect(() => {
        console.log('bookId', bookId);
        if (!bookId) {
            setIsAccessModalOpen(true);
        }
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

    // 예외처리용 regExp (주석처리)
    // const regExp= /[\/?:|*+<>\;\"#%\\]/gi;


    // 배치순서 부여 (groupedItem의 itemNo가 초기화되면서 itemNo가 순서대로 바뀜)
    const updatedGroupedItems = groupedItems.map(group => {
        let globalIndex = 1; // 전역 인덱스 초기화
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
    console.log('Question Data: ', questionData) // 데이터 확인완료

    const totalCount = updatedGroupedItems.reduce((count, group) => {
        return count + group.items.length; // 각 그룹의 질문 개수를 더함
    }, 0);

    const handleSave = async () => {
        //questionData와 updatedGroupedItems를 병합
        const questionDataMap = {};
        const passageMap = {};

        if (questionData) {
            questionData.itemList.forEach(question => {
                questionDataMap[question.itemId] = question; // itemId를 키로 하는 객체

                if (question.passageId) {
                    passageMap[question.passageId] = question.passageHtml; // passageId를 키로 하고 HTML 데이터를 저장
                }
            });
        }


        const exam = {
            email : email,
            bookId : bookId,
            examName : examName,
            totalCount : totalCount,
            collections: updatedGroupedItems.map(group=> ({
                questions: group.items.map(item=> {
                    const questionDetails = questionDataMap[item.itemId] || {};
                    return{
                        itemId: item.itemId,
                        questionUrl: item.questionUrl,
                        questionType: item.questionFormName,
                        url: item.questionUrl,
                        answerUrl: item.answerUrl,
                        difficulty: item.difficultyName,
                        descriptionUrl: item.explainUrl,
                        largeChapterName: item.largeChapterName,
                        largeChapterCode: item.largeChapterId,
                        mediumChapterName: item.mediumChapterName,
                        mediumChapterCode: item.mediumChapterId,
                        smallChapterName: item.smallChapterName,
                        smallChapterCode: item.smallChapterId,
                        topicChapterName: item.topicChapterName,
                        topicChapterCode: item.topicChapterId,
                        placementNumber: item.itemId,
                        // 병합되는 data
                        answer: questionDetails.answer,
                        answerHtml: questionDetails.answerHtml,
                        explain: questionDetails.explain, // 설명
                        explainHtml: questionDetails.explainHtml,
                        question: questionDetails.question,
                        questionHtml: questionDetails.questionHtml,
                        choice1Html: questionDetails.choice1Html,
                        choice2Html: questionDetails.choice2Html,
                        choice3Html: questionDetails.choice3Html,
                        choice4Html: questionDetails.choice4Html,
                        choice5Html: questionDetails.choice5Html
                        };
                }),
                passages: group.passageId ? [{
                    passageId: group.passageId,
                    url: group.passageUrl,
                    html: passageMap[group.passageId] || "", // passageMap에서 해당 passageId의 HTML 데이터를 가져옴
                }] : []
                // passages: [{
                //     passageId: group.passageId,
                //     url: group.passageUrl,
                //     html: group.p
                // }]
            }))
        }
        console.log("exam data: ",exam);
        await registerExam(exam)
    }
    console.log("updateItems: ",updatedGroupedItems);

    return (
        <div className="view-box">
            <ModalComponent
                title="비정상적인 접근"
                content={
                    <>비정상적인 접근이 감지되었습니다.<br/>
                        메인 페이지로 이동합니다.</>
                }
                handleClose={handleCloseAccessModal}
                open={isAccessModalOpen}
            />
            <CommonResource />
            <div className="view-top">
                <div className="paper-info">
                    <span>수학 1</span> 이준열(2015)
                </div>
                <div className="btn-wrap">
                    <Link to="/exam/step1/" className="btn-default">처음으로</Link>
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
                                    onChange={(e) => setExamName(e.target.value)}
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
                <Link to = "/exam/step2/" className="btn-step">STEP 2 문항 편집</Link>
                <button type="button" className="btn-step next done" onClick={handleSave}>시험지 저장하기</button>
            </div>
        </div>
    )
}
