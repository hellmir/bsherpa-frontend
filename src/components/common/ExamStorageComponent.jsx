import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import useCustomMove from "../../hooks/useCustomMove.jsx";
import {useQuery} from "@tanstack/react-query";
import {getExam, getQuestionImageData} from "../../api/mainApi.js";
import {getQuestionData} from "../../api/step3Api.js";
import {Box, CircularProgress} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CustomMainSelectComponent from "./CustomMainSelectComponent.jsx";
import Grid from "@mui/material/Grid";
import ExamCardComponent from "./ExamCardComponent.jsx";

export default function ExamStorageComponent() {
    const [selectedSubject, setSelectedSubject] = useState('국어');
    const [examList, setExamList] = useState([]);
    const [isLoading2, setIsLoading2] = useState(false);
    const loginState = useSelector(state => state.loginSlice);
    const email = loginState.email;
    const { moveToStepWithData } = useCustomMove();
    const [dataReady, setDataReady] = useState(false);
    const [enabledQuery, setEnabledQuery] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);  // 선택된 시험 ID 상태
    const [itemIds, setItemIds] = useState([]);  // 선택된 itemIds 상태
    const [successYn, setSuccessYn] = useState('');

    // userExam 쿼리
    const { data: userExam, isLoading } = useQuery({
        queryKey: ['email', email, 'subjectName', selectedSubject],
        queryFn: () => getExam(email, selectedSubject),
        enabled: !!email,
        staleTime: Infinity,
        select: (userExam) => {
            if (!userExam) {
                console.error("No userExam data available");
                return [];
            }
            if (!userExam.getExamResponses || userExam.getExamResponses.length === 0) {
                console.error("No getExamResponses available");
                return [];
            }
            console.log("받아오는 데이터: ",userExam);

            const structuredExamData = userExam.getExamResponses.map(exam => {
                const collections = exam.getCollectionsResponse.getCollectionResponses.flatMap(collection => {
                    const passages = collection.getPassagesResponse.getPassageResponses.length > 0
                        ? collection.getPassagesResponse.getPassageResponses[0]
                        : null;
                    const questions = collection.getQuestionsResponse.getQuestionResponses.map(q => ({
                        itemId: q.itemId,
                        questionUrl : q.url,
                        explainUrl : q.descriptionUrl,
                        passageUrl : passages?.url || null,
                        answerUrl : q.answerUrl,
                    }));
                    return questions;
                });

                return {
                    examId: exam.id,
                    examName: exam.examName,
                    className: exam.className,
                    grade: exam.grade,
                    subjectName: exam.subjectName,
                    itemCnt: exam.size,
                    items: collections,
                    isUserExam: true,
                };
            });

            return structuredExamData;
        },
    });
    console.log(userExam);

    useEffect(() => {
        if (userExam) {
            setExamList(userExam);
        }
    }, [userExam]);

    const handleModifyButtonClick = (examId) => {
        const selectedItemIds = getItemIds(examId);  // itemIds 추출
        setItemIds(selectedItemIds);  // itemIds 상태 업데이트
        setSelectedExamId(examId);  // 선택된 시험 ID 상태 업데이트
    };

    const getItemIds = (examId) => {
        const selectedExam = examList.find((exam) => exam.examId === examId);
        if (selectedExam) {
            return selectedExam.items.map(item => item.itemId);
        }
        return [];
    };

    // const handleModifyButtonClick = (examId) => {
    //     const selectedItemIds = getItemIds(examId);  // itemIds 추출
    //     setItemIds(selectedItemIds);  // itemIds 상태 업데이트
    //     setSelectedExamId(examId);  // 선택된 시험 ID 상태 업데이트
    // };
    //
    // const getItemIds = (examId) => {
    //     const selectedExam = examList.find((exam) => exam.examId === examId);
    //     if (selectedExam) {
    //         return selectedExam.items.map(item => item.itemId);
    //     }
    //     return [];
    // };

    useEffect(() => {
        if (selectedExamId) {
            const newItemIds = getItemIds(selectedExamId);
            if (newItemIds) {
                setItemIds(newItemIds);  // itemIds가 여기서 업데이트됨
            }
        }
    }, [selectedExamId]);

    // itemIds에 대한 query
    const { data: itemList, isLoading: questionLoading, isError: questionError } = useQuery({
        queryKey: ['itemIds', itemIds],
        queryFn: () => getQuestionImageData(itemIds),
        enabled: itemIds.length>0,
        staleTime: Infinity,
    });

    console.log(itemList)

    const tempItemList = itemList?.itemList || [];

    const toStep2Data = {
        tempItemList : tempItemList,
        apiResponse : itemList,
    }

    useEffect(() => {
        if (tempItemList) {
            const currentSuccessYn = tempItemList.successYn;  // 성공 여부 확인
            setSuccessYn(currentSuccessYn);  // successYn 상태 업데이트
        }
    }, [tempItemList]);

    console.log("temp: ",tempItemList)


    useEffect(() => {
        if (tempItemList && tempItemList.length > 0) {
            // 데이터가 준비되면 페이지 이동
            moveToStepWithData('step2', toStep2Data);
        } else if (questionError) {
            console.error("Error fetching question data");
        }
    }, [tempItemList, questionError, moveToStepWithData]);


    useEffect(() => {
        if (successYn === 'Y') {
            moveToStepWithData('step2', tempItemList); // successYn이 "Y"일 때만 페이지 이동
        } else if (questionError) {
            console.error("Error fetching question data");
        }
    }, [successYn, questionError, tempItemList, moveToStepWithData]);



    const groupedExams = [];
    for (let i = 0; i < examList.length; i += 3) {
        groupedExams.push(examList.slice(i, i + 3));
    }

    const handleSubjectChange = (subject) => {
        setSelectedSubject(subject);
        setExamList([]);
    };

    return (
        <Box
            component="main"
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'background.default',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
            }}
        >
            <Box sx={{ p: 4, minHeight: '100%' }}>
                <Toolbar />
                <Typography variant="h6" sx={{ marginBottom: 4 }}>
                    시험지 보관함
                </Typography>

                <CustomMainSelectComponent
                    subjectName={selectedSubject}
                    onSubjectChange={handleSubjectChange}
                />

                {isLoading2 ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                        <CircularProgress />
                    </Box>
                ) : examList.length > 0 ? (
                    <Box sx={{ marginY: 4 }}>
                        <Grid
                            container
                            spacing={4}
                            sx={{
                                maxWidth: 1200,
                                margin: '0 auto'
                            }}
                        >
                            {examList.map((exam) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={exam.examId}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <ExamCardComponent
                                        examId={exam.examId}
                                        examName={exam.examName}
                                        className={exam.className}
                                        subjectName={exam.subjectName}
                                        grade={exam.grade}
                                        onModifyButtonClick={handleModifyButtonClick}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '50vh'
                    }}>
                        <Typography variant="body1">
                            {selectedSubject} 과목의 시험지가 없습니다.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

