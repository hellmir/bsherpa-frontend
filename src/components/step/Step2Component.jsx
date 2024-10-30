import React, {useEffect, useRef, useState} from "react";
import CommonResource from "../../util/CommonResource.jsx";
import {useMutation, useQueries, useQuery} from "@tanstack/react-query";
import {
    getBookFromTsherpa,
    getChapterItemImagesFromTsherpa,
    getEvaluationsFromTsherpa,
    getExamItemImagesFromTsherpa,
    getSimilarItemsImagesFromTsherpa
} from "../../api/step2Api.js";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import Button from "@mui/material/Button";
import ConfirmationModal from "../common/ConfirmationModal.jsx";
import "../../assets/css/confirmationModal.css";
import "../../assets/css/comboBox.css";
import {setExamData} from "../../slices/examDataSlice.js";
import {useDispatch, useSelector} from "react-redux";
import Step2RightSideComponent from "./Step2RightSideComponent.jsx";
import ModalComponent from "../common/ModalComponent.jsx";
import DifficultyCountComponent from "../common/DifficultyCountComponent.jsx";
import {getDifficultyColor} from "../../util/difficultyColorProvider.js";
import ErrorReportModal from "../common/ErrorReportModalComponent.jsx";

export default function Step2Component() {
    const dispatch = useDispatch();
    const itemContainerRef = useRef(null);

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isSimilarPage, setIsSimilarPage] = useState(false);
    const [similarItems, setSimilarItems] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(null);
    const [deletedItems, setDeletedItems] = useState([]);
    const [noSimilarItemsMessage, setNoSimilarItemsMessage] = useState("");
    const [isNoSimilarItemsModalOpen, setIsNoSimilarItemsModalOpen] = useState(false);
    const [isErrorReportOpen, setIsErrorReportOpen] = useState(false);

    const fetchSimilarItems = (itemId, questionIndex) => {
        getSimilarItemsImagesFromTsherpa(itemId)
            .then((data) => {
                if (data.itemList.length === 0) {
                    setNoSimilarItemsMessage("검색된 유사 문제가 없습니다.");
                    setIsNoSimilarItemsModalOpen(true);
                } else {
                    setSimilarItems(data.itemList);
                    setIsSimilarPage(true);
                    setQuestionIndex(questionIndex);
                    console.log("유사 문제 목록: ", data.itemList);
                }
            })
            .catch((error) => {
                console.error("유사 문제 가져오기 실패:", error);
            });
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false)
    const handleCloseNoSimilarItemsModal = () => setIsNoSimilarItemsModalOpen(false);
    const handleOpenErrorReport = () => setIsErrorReportOpen(true);
    const handleCloseErrorReport = () => setIsErrorReportOpen(false);

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

    const examIdList = useSelector((state) => state.examIdSlice);
    const questionQueries = useQueries({
        queries: examIdList?.length
            ? examIdList.map((examId) => ({
                queryKey: ["questionData", examId],
                queryFn: () => getExamItemImagesFromTsherpa(examId),
                staleTime: 1000 * 3,
            }))
            : [],
    });

    const questionsDataFromExams = questionQueries
        .filter((query) => query.isSuccess)
        .map((query) => query.data.itemList);

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
            levelCnt: [3, 3, 3, 3, 3],
            minorClassification: [
                {
                    large: 115401,
                    medium: 11540101,
                    small: 1154010101,
                    subject: 1154
                },
                {
                    large: 115402,
                    medium: 11540202,
                    small: 1154020202,
                    subject: 1154
                }
            ],
            questionForm: "multiple,subjective"
        }
        : null;
    console.log(itemsRequestForm);

    const {data: questionsData, isLoading, error} = useQuery({
        queryKey: ["getChapterItemsRequest", itemsRequestForm],
        queryFn: () => getChapterItemImagesFromTsherpa(itemsRequestForm),
        enabled: !examIdList?.length && !!itemsRequestForm,
        staleTime: 1000 * 3,
    });

    const fetchQuestions = useMutation({
        mutationFn: (form) => getChapterItemImagesFromTsherpa(form),
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
        if (examIdList?.length && questionsDataFromExams.length > 0 && itemList.length === 0) {
            const combinedData = {data: {itemList: questionsDataFromExams.flat()}};
            console.log("questionsData 전체 구조:", combinedData);
            console.log("questionsData.data.itemList 확인:", combinedData.data.itemList);

            setItemList(combinedData.data.itemList);
            setTempItemList(combinedData.data.itemList);
            organizeItems(combinedData.data.itemList);
        }
    }, [questionsDataFromExams]);

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
        console.log("Step2RightSideComponent options open:", !isProblemOptionsOpen);
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

    const handleSimilarPageToggle = (itemId, questionIndex) => {
        fetchSimilarItems(itemId, questionIndex);
    };

    const handleDeleteItem = (itemId) => {
        const itemToDelete = itemList.find((item) => item.itemId === itemId);
        if (itemToDelete) {
            const relatedPassage = groupedItems.find(group => group.passageId === itemToDelete.passageId);
            const passageInfo = relatedPassage ? {
                passageId: relatedPassage.passageId,
                passageUrl: relatedPassage.passageUrl
            } : null;

            setDeletedItems((prevDeletedItems) => {
                const updatedDeletedItems = [...prevDeletedItems];
                const existingGroup = updatedDeletedItems.find(group => group.passageId === itemToDelete.passageId);

                if (existingGroup) {
                    existingGroup.items.push(itemToDelete);
                } else {
                    updatedDeletedItems.push({
                        passageId: itemToDelete.passageId,
                        passageUrl: passageInfo?.passageUrl,
                        items: [itemToDelete]
                    });
                }

                return updatedDeletedItems;
            });

            const updatedItemList = itemList.filter((item) => item.itemId !== itemId);
            setItemList(updatedItemList);

            const updatedGroupedItems = groupedItems.map((group) => ({
                ...group,
                items: group.items.filter((item) => item.itemId !== itemId),
            })).filter((group) => group.items.length > 0);

            setGroupedItems(updatedGroupedItems);
        }
    };

    const handleDeletePassage = (passageId) => {
        const itemsToDelete = itemList.filter((item) => item.passageId === passageId);

        setDeletedItems((prevDeletedItems) => [
            ...prevDeletedItems,
            {
                passageId: passageId,
                passageUrl: itemsToDelete[0]?.passageUrl || null,
                items: itemsToDelete,
            },
        ]);

        const updatedItemList = itemList.filter((item) => item.passageId !== passageId);
        setItemList(updatedItemList);

        const updatedGroupedItems = groupedItems.filter((group) => group.passageId !== passageId);
        setGroupedItems(updatedGroupedItems);
    };

    const scrollToNewItem = (newItemId) => {
        const newItemElement = document.getElementById(`question-${newItemId}`);
        if (newItemElement) {
            newItemElement.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    const handleAddItem = (newItem) => {
        setItemList((prevItemList) => {
            const updatedItemList = [...prevItemList, newItem];

            scrollToNewItem(newItem.itemId);

            return updatedItemList;
        });

        setDeletedItems((prevDeletedItems) =>
            prevDeletedItems
                .map((group) => ({
                    ...group,
                    items: group.items.filter((item) => item.itemId !== newItem.itemId),
                }))
                .filter((group) => group.items.length > 0)
        );

        setSimilarItems((prevSimilarItems) =>
            prevSimilarItems.filter((item) => item.itemId !== newItem.itemId)
        );
    };

    const handleDragEnd = (result) => {
        const {destination, source, type} = result;

        if (!destination) return;

        const updatedGroups = JSON.parse(JSON.stringify(groupedItems));

        if (type === "PASSAGE_GROUP") {
            const [movedGroup] = updatedGroups.splice(source.index, 1);
            updatedGroups.splice(destination.index, 0, movedGroup);

            setGroupedItems(updatedGroups);

            const newSortedItemList = updatedGroups.flatMap(group => group.items);
            setItemList(newSortedItemList);

            console.log(`지문을 ${source.index}에서 ${destination.index}로 이동`);
        } else if (type === "ITEM") {
            const sourcePassageId = source.droppableId;
            const destinationPassageId = destination.droppableId;
            console.log(sourcePassageId, destinationPassageId, 'asdlfjads');

            const sourcePassageIdNumber = Number(sourcePassageId);
            const destinationPassageIdNumber = Number(destinationPassageId);

            console.log(`sourcePassageId: ${sourcePassageIdNumber}, destinationPassageId: ${destinationPassageIdNumber}`);
            console.log('현재 groupedItems:', updatedGroups.map(group => group.passageId));

            if (sourcePassageId !== destinationPassageId && sourcePassageId !== "noPassage" && destinationPassageId !== "noPassage") {
                console.log('다른 지문으로 이동할 수 없습니다.');
                handleOpenModal();
                return;
            }

            console.log(`문항을 ${source.index}에서 ${destination.index}로 이동`);

            const groupIndex = updatedGroups.findIndex(group => {
                if (typeof group.passageId === "string" && group.passageId === sourcePassageId) {
                    return true;
                }
                if (typeof group.passageId === "number" && group.passageId === sourcePassageIdNumber) {
                    return true;
                }
                return false;
            });
            if (groupIndex === -1) {
                console.error('해당 지문 그룹을 찾을 수 없습니다.');
                return;
            }

            const group = updatedGroups[groupIndex];

            const itemIndexInGroup = source.index - itemList.findIndex(item => item.passageId === sourcePassageIdNumber);

            if (itemIndexInGroup < 0 || itemIndexInGroup >= group.items.length) {
                console.error('item 인덱스가 존재하지 않습니다.');
                return;
            }

            const [movedItem] = group.items.splice(itemIndexInGroup, 1);

            if (!movedItem || !movedItem.itemId) {
                console.error(`movedItem이 올바르지 않거나 itemId가 존재하지 않습니다: `, movedItem);
                return;
            }

            const destinationIndexInGroup = destination.index - itemList.findIndex(item => item.passageId === destinationPassageIdNumber);

            group.items.splice(destinationIndexInGroup, 0, movedItem);

            setGroupedItems(updatedGroups);

            const newSortedItemList = updatedGroups.flatMap(group => group.items);
            setItemList(newSortedItemList);
        }
    };

    const handleClickMoveToStepOne = () => {
        console.log('STEP 1 단원 선택');
        moveToPath('../step1')
    };

    const handleClickMoveToStepThree = () => {
        console.log(`STEP 3 시험지 저장 : ${bookId, totalQuestions, itemList}`);
        dispatch(setExamData({bookId, totalQuestions, groupedItems}));
        moveToStepWithData('step3', {bookId, groupedItems});
    };

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
            <ModalComponent
                title="이동 불가"
                content="다른 지문으로 이동할 수 없습니다."
                handleClose={handleCloseModal}
                open={isModalOpen}
            />
            <ModalComponent
                title="검색 결과 없음"
                content={noSimilarItemsMessage}
                handleClose={handleCloseNoSimilarItemsModal}
                open={isNoSimilarItemsModalOpen}
            />
            <ErrorReportModal isOpen={isErrorReportOpen} onClose={handleCloseErrorReport} />
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
                                {!examIdList.length && (
                                    <button className="btn-default btn-research" onClick={handleReSearchClick}>
                                        <i className="research"></i>재검색
                                    </button>
                                )}
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
                                                            }}
                                                                    onClick={() => handleDeletePassage(group.passageId)}
                                                            >
                                                            </button>
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
                                                             id={`question-${item.itemId}`}
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
                                                                            onClick={handleOpenErrorReport}></button>

                                                                    <button type="button"
                                                                            className="btn-delete"
                                                                            onClick={() => handleDeleteItem(item.itemId)}
                                                                    >
                                                                    </button>
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
                                                                        <button
                                                                            type="button"
                                                                            className="btn-similar-que btn-default"
                                                                            onClick={() => handleSimilarPageToggle(item.itemId, itemList.indexOf(item) + 1)}
                                                                        >
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
                                    <DifficultyCountComponent
                                        difficultyCounts={difficultyCounts}
                                        getDifficultyColor={getDifficultyColor}
                                        totalQuestions={totalQuestions}
                                    />
                                </div>
                                <div className="cnt-box type01">
                                    <Step2RightSideComponent
                                        itemList={itemList}
                                        onDragEnd={handleDragEnd}
                                        onShowSimilar={(item) => handleSimilarPageToggle(item, itemList.indexOf(item) + 1)}
                                        questionIndex={questionIndex}
                                        similarItems={similarItems}
                                        deletedItems={deletedItems}
                                        onAddItem={handleAddItem}
                                    />
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