import React, {useEffect, useState} from "react";
import CommonResource from "../../util/CommonResource.jsx";
import {useQuery} from "@tanstack/react-query";
import {getBookFromTsherpa, getEvaluationsFromTsherpa, getItemImagesFromTsherpa} from "../../api/step2Api.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Button from "@mui/material/Button";
import '../../assets/css/stepTwoCustom.css';

export default function Step2Component() {
    const [isProblemOptionsOpen, setIsProblemOptionsOpen] = useState(false);
    const [isSortOptionsOpen, setIsSortOptionsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("문제만 보기");
    const [selectedSortOption, setSelectedSortOption] = useState("단원순");
    const [itemList, setItemList] = useState([]);
    const [difficultyCounts, setDifficultyCounts] = useState({하: 0, 중: 0, 상: 0});

    // TODO: Step0으로부터 교재 ID와 단원 코드 정보 받아서 연동
    // const bookId = useSelector(state => state.bookIdSlice)
    const bookId = 1154;
    console.log(`step2 ${bookId}`)

    const {moveToStepWithData, moveToPath} = useCustomMove();

    const {data: bookData} = useQuery({
        queryKey: ['bookData', bookId], // 쿼리 키 명시
        queryFn: () => getBookFromTsherpa(bookId),
        staleTime: 1000 * 3,
        enabled: !!bookId  // bookId가 존재할 때만 쿼리 실행
    });
    console.log('교재 정보: ', bookData)

    const subjectName = bookData?.subjectInfoList?.[0]?.subjectName?.split('(')[0] || "과목명 없음";
    const author = bookData?.subjectInfoList?.[0]?.subjectName?.match(/\(([^)]+)\)/)?.[1] || "저자 정보 없음";
    const curriculumYear = bookData?.subjectInfoList?.[0]?.curriculumName || "년도 정보 없음";

    const {data: evaluationsData} = useQuery({
        queryKey: [],
        queryFn: () => getEvaluationsFromTsherpa(bookId),
        staleTime: 1000 * 3
    })
    console.log('평가 영역 데이터: ', evaluationsData)

    const activityCategoryList = evaluationsData
        ? evaluationsData.evaluationList.map(evaluation => evaluation.domainId)
        : [];

    console.log(`평가 영역 목록: ${activityCategoryList}`)

    // TODO: Step1으로부터 교재 ID, 평가 영역 ID, 난이도 별 문제 수, 단원 코드 정보, 문제 유형을 받아서 연동
    const itemsRequestForm = evaluationsData
        ? {
            activityCategoryList: activityCategoryList,
            levelCnt: [5, 5, 5, 5, 5],
            minorClassification: [
                {
                    large: 115401,
                    medium: 11540101,
                    small: 1154010101,
                    subject: 1154,
                    topic: 115401010101
                }
            ],
            questionForm: "multiple,subjective"
        }
        : null;
    console.log(itemsRequestForm);

    const {data: questionsData, isLoading, error} = useQuery({
        queryKey: ['getChapterItemsRequest', itemsRequestForm],
        queryFn: () => getItemImagesFromTsherpa(itemsRequestForm),
        enabled: !!itemsRequestForm,
        staleTime: 1000 * 3
    });

    useEffect(() => {
        if (!isLoading && questionsData) {
            console.log(questionsData);
        }
    }, [isLoading, questionsData]);

    useEffect(() => {
        console.log("isProblemOptionsOpen changed:", isProblemOptionsOpen);
    }, [isProblemOptionsOpen]);

    useEffect(() => {
        if (questionsData?.data?.itemList) {
            console.log("questionsData 전체 구조:", questionsData);
            console.log("questionsData.data.itemList 확인:", questionsData.data.itemList);
            setItemList(questionsData.data.itemList);
        }
    }, [questionsData]);

    useEffect(() => {
        const counts = {하: 0, 중: 0, 상: 0};
        itemList.forEach(item => {
            counts[item.difficultyName] += 1;
        });
        setDifficultyCounts(counts);
    }, [itemList]);
    console.log(`난이도 별 문제 수: ${difficultyCounts}`);

    const totalQuestions = itemList.length;

    if (isLoading) {
        return <div>데이터 로드 중...</div>;
    }

    if (error) {
        return <div>데이터 로드 중 오류가 발생했습니다: {error.message}</div>;
    }

    const toggleProblemOptions = () => {
        setIsProblemOptionsOpen(!isProblemOptionsOpen);
        console.log("Problem options open:", !isProblemOptionsOpen);
    };

    const toggleSortOptions = () => {
        setIsSortOptionsOpen(!isSortOptionsOpen);
        console.log("Sort options open:", !isSortOptionsOpen);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsProblemOptionsOpen(false);
    };

    const handleSortOptionSelect = (option) => {
        setSelectedSortOption(option);
        setIsSortOptionsOpen(false);
    };

    const handleClickMoveToStepOne = () => {
        console.log('STEP 1 단원 선택');
        moveToPath('../step1')
    };

    const handleClickMoveToStepThree = () => {
        console.log(`STEP 3 시험지 저장 : ${bookId, itemList}`);
        moveToStepWithData('step3', {bookId, itemList});
    };

    function getDifficultyColor(difficultyName) {
        switch (difficultyName) {
            case "상":
                return "yellow";
            case "중":
                return "green";
            case "하":
                return "purple";
            default:
                return "gray";
        }
    }

    return (
        <>
            <CommonResource/>
            <div id="wrap" className="full-pop-que">
                <div className="full-pop-wrap">
                    <div className="pop-header">
                        <ul className="title">
                            <li>STEP 1 단원선택</li>
                            <li className="active">STEP 2 문항 편집</li>
                            <li>STEP 3 시험지 저장</li>
                        </ul>
                        <button type="button" className="del-btn"></button>
                    </div>
                    <div className="pop-content">
                        <div className="view-box">
                            <div className="view-top">
                                <div className="paper-info">
                                    <span>{subjectName}</span> {author}({curriculumYear})
                                </div>
                                <button className="btn-default btn-research"><i className="research"></i>재검색</button>
                                <button className="btn-default pop-btn" data-pop="que-scope-pop">출제범위</button>
                            </div>
                            <div className="view-bottom type01">
                                <div className="cnt-box">
                                    <div className="cnt-top">
                                        <span className="title">문제 목록</span>
                                        <div className="right-area">
                                            <div className="select-wrap">
                                                <button
                                                    type="button"
                                                    className="select-btn"
                                                    onClick={toggleProblemOptions}
                                                >
                                                    {selectedOption}
                                                </button>
                                                {isProblemOptionsOpen && (
                                                    <ul className="select-list open">
                                                        <li>
                                                            <span onClick={() => handleOptionSelect("문제만 보기")}>
                                                                문제만 보기
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <span onClick={() => handleOptionSelect("문제+정답 보기")}>
                                                                문제+정답 보기
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <span onClick={() => handleOptionSelect("문제+해설+정답 보기")}>
                                                                문제+해설+정답 보기
                                                            </span>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="select-wrap">
                                                <button
                                                    type="button"
                                                    className="select-btn"
                                                    onClick={toggleSortOptions}
                                                >
                                                    {selectedSortOption}
                                                </button>
                                                {isSortOptionsOpen && (
                                                    <ul className="select-list open">
                                                        <li>
                                                            <span onClick={() => handleSortOptionSelect("단원순")}>
                                                                단원순
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <span onClick={() => handleSortOptionSelect("난이도순")}>
                                                                난이도순
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <span onClick={() => handleSortOptionSelect("문제 형태순")}>
                                                                문제 형태순
                                                            </span>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="view-que-list scroll-inner">
                                        {questionsData?.data?.itemList?.length > 0 ? (
                                            questionsData.data.itemList.map((item, index) => (
                                                <div key={index} className="view-que-box">
                                                    <div className="que-top">
                                                        <div className="title">
                                                            <span className="num">{index + 1}</span>
                                                            <div className="que-badge-group">
                                                                <span
                                                                    className={`que-badge ${getDifficultyColor(item.difficultyName)}`}>
                                {item.difficultyName}
                            </span>
                                                                <span className="que-badge gray">
                                {item.questionFormCode <= 50 ? "객관식" : "주관식"}
                            </span>
                                                            </div>
                                                        </div>
                                                        <div className="btn-wrap">
                                                            <button type="button" className="btn-error pop-btn"
                                                                    data-pop="error-report-pop"></button>
                                                            <button type="button" className="btn-delete"></button>
                                                        </div>
                                                    </div>
                                                    <div className="view-que">
                                                        <div className="que-content">
                                                            {item.questionUrl ? (
                                                                <img src={item.questionUrl} alt="문제 이미지"/>
                                                            ) : (
                                                                <p className="txt">문제 텍스트 없음</p>
                                                            )}
                                                        </div>
                                                        <div className="que-bottom">
                                                            <div className="data-area">
                                                                <div className="que-info">
                                                                    <p className="answer"><span
                                                                        className="label">해설</span></p>
                                                                    <div className="data-answer-area">
                                                                        <div className="paragraph"
                                                                             style={{textAlign: "justify"}}>
                                                                            <span
                                                                                className="txt">해설 텍스트가 나오는 영역입니다.</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="data-area type01">
                                                                <div className="que-info">
                                                                    <p className="answer"><span
                                                                        className="label type01">정답</span></p>
                                                                    <div className="data-answer-area">
                                                                        <div className="paragraph"
                                                                             style={{textAlign: "justify"}}>
                                                                            <span className="txt"> ①</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button type="button"
                                                                        className="btn-similar-que btn-default">
                                                                    <i className="similar"></i> 유사 문제
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="que-info-last">
                                                        <p className="chapter">자연수의
                                                            성질 &gt; 소인수분해 &gt; 거듭제곱 &gt; 거듭제곱으로표현</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div>문제가 없습니다.</div>
                                        )}
                                    </div>
                                    <div className="bottom-box">
                                        <div className="que-badge-group type01">
                                            <div className="que-badge-wrap">
                                                <span className="que-badge purple">하</span>
                                                <span className="num">{difficultyCounts.하}</span>
                                            </div>
                                            <div className="que-badge-wrap">
                                                <span className="que-badge green">중</span>
                                                <span className="num">{difficultyCounts.중}</span>
                                            </div>
                                            <div className="que-badge-wrap">
                                                <span className="que-badge yellow">상</span>
                                                <span className="num">{difficultyCounts.상}</span>
                                            </div>
                                        </div>
                                        <p className="total-num">총 <span>{totalQuestions}</span>문제</p>
                                    </div>
                                </div>
                                <div className="cnt-box type01">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="step-btn-wrap">
                        <Button
                            variant="contained"
                            onClick={handleClickMoveToStepOne}
                            className="btn-step"
                        >
                            <BorderColorOutlinedIcon/>STEP 1 단원 선택
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleClickMoveToStepThree}
                            className="btn-step next"
                        >
                            <BorderColorOutlinedIcon/>STEP 3 시험지 저장
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
