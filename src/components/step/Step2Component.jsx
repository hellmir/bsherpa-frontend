import React, {useEffect, useState} from "react";
import CommonResource from "../../util/CommonResource.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getBookFromTsherpa, getEvaluationsFromTsherpa, getItemImagesFromTsherpa} from "../../api/step2Api.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Button from "@mui/material/Button";
import ConfirmationModal from "../common/ConfirmationModal.jsx";
import "../../assets/css/confirmationModal.css";
import "../../assets/css/comboBox.css";
import {setExamData} from "../../slices/examDataSlice.js";
import {useDispatch, useSelector} from "react-redux";

export default function Step2Component() {
    const dispatch = useDispatch();
    const [isProblemOptionsOpen, setIsProblemOptionsOpen] = useState(false);
    const [isSortOptionsOpen, setIsSortOptionsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("문제만 보기");
    const [selectedSortOption, setSelectedSortOption] = useState("단원순");
    const [groupedItems, setGroupedItems] = useState([]);
    const [itemList, setItemList] = useState([]);
    const [tempItemList, setTempItemList] = useState([]);
    const [difficultyCounts, setDifficultyCounts] = useState([
        {level: "최하", count: 0},
        {level: "하", count: 0},
        {level: "중", count: 0},
        {level: "상", count: 0},
        {level: "최상", count: 0}
    ]);
    const [tempDifficultyCounts, setTempDifficultyCounts] = useState([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSorted, setIsSorted] = useState(false);

    // TODO: Step0으로부터 시험지 정보 받아서 연동
    const bookId = useSelector((state) => state.bookIdSlice);
    console.log(`교재 ID: ${bookId}`)

    const {moveToStepWithData, moveToPath} = useCustomMove();

    const {data: bookData} = useQuery({
        queryKey: ['bookData', bookId],
        queryFn: () => getBookFromTsherpa(bookId),
        staleTime: 1000 * 3,
        enabled: !!bookId
    });
    console.log('교재 정보: ', bookData)

    const subjectName = bookData?.subjectInfoList?.[0]?.subjectName?.split('(')[0] || "과목명 없음";
    const author = bookData?.subjectInfoList?.[0]?.subjectName?.match(/\(([^)]+)\)/)?.[1] || "저자 정보 없음";
    const curriculumYear = bookData?.subjectInfoList?.[0]?.curriculumName || "년도 정보 없음";

    const {data: evaluationsData} = useQuery({
        queryKey: ['evaluationsData', bookId],
        queryFn: () => getEvaluationsFromTsherpa(bookId),
        staleTime: 1000 * 3
    })
    console.log('평가 영역 데이터: ', evaluationsData)

    const activityCategoryList = evaluationsData
        ? evaluationsData.evaluationList.map(evaluation => evaluation.domainId)
        : [];

    console.log(`평가 영역 목록: ${activityCategoryList}`)

    // TODO: Step1으로부터 평가 영역 ID, 난이도 별 문제 수, 단원 코드 정보, 문제 유형을 받아서 연동
    const itemsRequestForm = evaluationsData
        ? {
            activityCategoryList: activityCategoryList,
            levelCnt: [1, 1, 1, 1, 1],
            minorClassification: [
                {
                    large: 115401,
                    medium: 11540101,
                    small: 1154010101,
                    subject: 1154
                }
            ],
            questionForm: "multiple,subjective"
        }
        : null;
    console.log(itemsRequestForm);

    const fetchQuestions = useMutation({
        mutationFn: (form) => getItemImagesFromTsherpa(form),
        onSuccess: (data) => {
            const newTempItemList = [...data.data.itemList];
            const counts = [
                {level: "최하", count: 0},
                {level: "하", count: 0},
                {level: "중", count: 0},
                {level: "상", count: 0},
                {level: "최상", count: 0}
            ];
            newTempItemList.forEach(item => {
                const difficulty = counts.find(d => d.level === item.difficultyName);
                if (difficulty) difficulty.count += 1;
            });

            setTempItemList(newTempItemList);
            setTempDifficultyCounts(counts);

            console.log('새로 받아 온 문제 목록: ', data.data.itemList);
            console.log('새로 받아 온 난이도 별 문제 수: ', counts);

            setIsConfirmOpen(true);
        },
        onError: (error) => {
            console.error("문항 재검색 실패: ", error);
        }
    });

    const {data: questionsData, isLoading, error} = useQuery({
        queryKey: ['getChapterItemsRequest', itemsRequestForm],
        queryFn: () => getItemImagesFromTsherpa(itemsRequestForm),
        enabled: !!itemsRequestForm,
        staleTime: 1000 * 3
    });

    useEffect(() => {
        if (!isSorted && groupedItems.length > 0) {
            sortGroupedItems();
            setIsSorted(true);
        }
    }, [groupedItems]);

    useEffect(() => {
        if (!isLoading && questionsData) {
            console.log(questionsData);
        }
    }, [isLoading, questionsData]);

    useEffect(() => {
        console.log("isProblemOptionsOpen changed:", isProblemOptionsOpen);
    }, [isProblemOptionsOpen]);

    useEffect(() => {
        if (questionsData?.data?.itemList && itemList.length === 0) {
            console.log("questionsData 전체 구조:", questionsData);
            console.log("questionsData.data.itemList 확인:", questionsData.data.itemList);
            setItemList(questionsData.data.itemList);
            setTempItemList(questionsData.data.itemList);
            organizeItems(questionsData.data.itemList);
        }
    }, [questionsData]);


    const organizeItems = (items) => {
        const passageGroups = items.reduce((acc, item) => {
            const passageId = item.passageId || "noPassage";
            if (!acc[passageId]) {
                acc[passageId] = {passageId, passageUrl: item.passageUrl, items: []};
            }
            acc[passageId].items.push(item);
            return acc;
        }, {});

        const groupedArray = Object.values(passageGroups).map(group => {
            group.items.sort((a, b) => a.itemNo - b.itemNo);
            return group;
        });

        groupedArray.sort((a, b) => {
            const firstItemA = a.items[0].itemNo;
            const firstItemB = b.items[0].itemNo;
            return firstItemA - firstItemB;
        });

        setGroupedItems(groupedArray);
        setIsSorted(false);
    };

    useEffect(() => {
        const counts = [
            {level: "최하", count: 0},
            {level: "하", count: 0},
            {level: "중", count: 0},
            {level: "상", count: 0},
            {level: "최상", count: 0}
        ];
        itemList.forEach(item => {
            const difficulty = counts.find(d => d.level === item.difficultyName);
            if (difficulty) difficulty.count += 1;
        });
        setDifficultyCounts(counts.filter(c => c.count > 0));
    }, [itemList]);
    console.log('난이도 별 문제 수: ', difficultyCounts);

    useEffect(() => {
        sortGroupedItems();
    }, [selectedSortOption]);

    const sortGroupedItems = () => {
        const sortedGroups = groupedItems.map(group => {
            const sortedItems = [...group.items];

            if (selectedSortOption === "단원순") {
                sortedItems.sort((a, b) =>
                    a.largeChapterId - b.largeChapterId ||
                    a.mediumChapterId - b.mediumChapterId ||
                    a.smallChapterId - b.smallChapterId ||
                    a.topicChapterId - b.topicChapterId
                );
            } else if (selectedSortOption === "난이도순") {
                const difficultyOrder = ["최하", "하", "중", "상", "최상"];
                sortedItems.sort((a, b) =>
                    difficultyOrder.indexOf(a.difficultyName) - difficultyOrder.indexOf(b.difficultyName)
                );
            } else if (selectedSortOption === "문제 형태순") {
                sortedItems.sort((a, b) =>
                    (a.questionFormCode <= 50 ? -1 : 1) - (b.questionFormCode <= 50 ? -1 : 1)
                );
            }

            return {...group, items: sortedItems};
        });

        setGroupedItems(sortedGroups);

        const newSortedItemList = sortedGroups.flatMap(group => group.items);
        setItemList(newSortedItemList);
    };

    useEffect(() => {
        console.log("itemList가 업데이트되었습니다: ", itemList);
    }, [itemList]);

    const totalQuestions = itemList.length;

    const [forceRender, setForceRender] = useState(false);

    const handleReSearchClick = () => {
        if (itemsRequestForm) {
            fetchQuestions.mutate(itemsRequestForm, {
                onSuccess: () => {
                    setForceRender(!forceRender);
                }
            });
        } else {
            console.warn("itemsRequestForm 값이 존재하지 않습니다.");
        }
    };

    const handleConfirm = () => {
        setItemList([...tempItemList]);
        setDifficultyCounts([...tempDifficultyCounts]);
        setIsConfirmOpen(false);
        organizeItems(tempItemList);
    };

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
        dispatch(setExamData({bookId, groupedItems}));
        moveToStepWithData('step3', {bookId, groupedItems});
    };

    function getDifficultyColor(difficultyName) {
        switch (difficultyName) {
            case "최상":
                return "red";
            case "상":
                return "orange";
            case "중":
                return "green";
            case "하":
                return "purple";
            case "최하":
                return "black";
            default:
                return "gray";
        }
    }

    return (
        <>
            <CommonResource/>
            {isConfirmOpen && (
                <ConfirmationModal
                    title="문항 재검색"
                    message="문항 구성이 자동으로 변경됩니다."
                    details={tempDifficultyCounts.filter(count => count.count > 0)}
                    onCancel={() => setIsConfirmOpen(false)}
                    onConfirm={handleConfirm}
                />
            )}
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
                                <button className="btn-default btn-research" onClick={handleReSearchClick}>
                                    <i className="research"></i>재검색
                                </button>
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
                <span onClick={() => handleOptionSelect("문제+정답+해설 보기")}>
                    문제+정답+해설 보기
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
                                                            <span onClick={() => handleSortOptionSelect("사용자 정렬")}>
                                                                사용자 정렬
                                                            </span>
                                                        </li>
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
                                        {groupedItems.length > 0 ? (
                                            groupedItems.map((group, groupIndex) => (
                                                <div key={`group-${group.passageId}-${groupIndex}`}
                                                     className="passage-group">
                                                    {group.passageId !== "noPassage" && (
                                                        <div className="passage-group-wrapper" style={{
                                                            border: "1px solid #ddd",
                                                            padding: "20px",
                                                            borderRadius: "8px",
                                                            marginBottom: "20px",
                                                            position: "relative"
                                                        }}>
                                                            <div className="passage-group-header" style={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "flex-start",
                                                                borderBottom: "1px solid #ddd",
                                                                paddingBottom: "5px",
                                                                marginBottom: "10px"
                                                            }}>
    <span style={{fontSize: "18px", fontWeight: "bold", marginTop: "-10px"}}>
    {itemList.indexOf(group.items[0]) + 1} ~ {itemList.indexOf(group.items[group.items.length - 1]) + 1}
</span>
                                                            </div>

                                                            <button type="button" className="btn-delete-2" style={{
                                                                position: "absolute",
                                                                right: "40px",
                                                                top: "10px",
                                                                zIndex: "2",
                                                                width: "22px",
                                                                height: "22px",
                                                                fontSize: "16px"
                                                            }}></button>
                                                            <div className="passage" style={{
                                                                border: "1px solid #ccc",
                                                                borderRadius: "8px",
                                                                padding: "10px"
                                                            }}>
                                                                <img src={group.passageUrl} alt="지문 이미지"
                                                                     style={{width: "100%"}}/>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {group.items.map((item, index) => (
                                                        <div key={`item-${item.itemId}-${index}`}
                                                             className="view-que-box"
                                                             style={{marginTop: "10px"}}>
                                                            <div className="que-top">
                                                                <div className="title">
                                                                    <span
                                                                        className="num">{itemList.indexOf(item) + 1}</span>
                                                                    <div className="que-badge-group">
                                    <span className={`que-badge ${getDifficultyColor(item.difficultyName)}`}>
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
                                                                    <button type="button"
                                                                            className="btn-delete"></button>
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
                                                                    {(selectedOption === "문제+정답 보기" || selectedOption === "문제+정답+해설 보기") && (
                                                                        <div className="data-area">
                                                                            <div className="que-info">
                                                                                <p className="answer">
                                                                                    <span className="label type01"
                                                                                          style={{
                                                                                              display: "block",
                                                                                              textAlign: "left",
                                                                                              paddingLeft: "20px"
                                                                                          }}>정답</span>
                                                                                </p>
                                                                                <div className="data-answer-area">
                                                                                    {item.answerUrl ? (
                                                                                        <img src={item.answerUrl}
                                                                                             alt="정답 이미지"/>
                                                                                    ) : (
                                                                                        <div className="paragraph"
                                                                                             style={{textAlign: "justify"}}>
                                                                                            <span
                                                                                                className="txt">정답 없음</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    {selectedOption === "문제+정답+해설 보기" && (
                                                                        <div className="data-area">
                                                                            <div className="que-info">
                                                                                <p className="answer">
                                                                                    <span className="label" style={{
                                                                                        display: "block",
                                                                                        textAlign: "left",
                                                                                        paddingLeft: "20px"
                                                                                    }}>해설</span>
                                                                                </p>
                                                                                <div className="data-answer-area">
                                                                                    {item.explainUrl ? (
                                                                                        <img src={item.explainUrl}
                                                                                             alt="해설 이미지"/>
                                                                                    ) : (
                                                                                        <div className="paragraph"
                                                                                             style={{textAlign: "justify"}}>
                                                                                            <span
                                                                                                className="txt">해설 없음</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    <div className="data-area type01">
                                                                        <button type="button"
                                                                                className="btn-similar-que btn-default">
                                                                            <i className="similar"></i> 유사 문제
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="que-info-last">
                                                                <p className="chapter">
                                                                    {item.largeChapterName} &gt; {item.mediumChapterName} &gt; {item.smallChapterName} &gt; {item.topicChapterName}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))
                                        ) : (
                                            <div>문제가 없습니다.</div>
                                        )}
                                    </div>
                                    <div className="bottom-box">
                                        <div className="que-badge-group type01">
                                            {difficultyCounts.filter(d => d.count > 0).map(difficulty => (
                                                <div key={difficulty.level} className="que-badge-wrap">
            <span className={`que-badge`} style={{color: getDifficultyColor(difficulty.level)}}>
                {difficulty.level}
            </span>
                                                    <span className="num">{difficulty.count}</span>
                                                </div>
                                            ))}
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
