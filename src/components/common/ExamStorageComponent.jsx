import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { getExam } from "../../api/mainApi.js";
import { CircularProgress } from "@mui/material";
import ExamCardComponent from "./ExamCardComponent";
import Grid from "@mui/material/Grid";
import CustomMainSelectComponent from "./CustomMainSelectComponent.jsx";
import { useState,useEffect } from 'react';
import jwtAxios from "../../util/jwtUtil.jsx";
import KoreanBook from '../../assets/korean.jpg'
import MathBook from '../../assets/math.jpg'
import EnglishBook from '../../assets/english.png'
import SocialBook from '../../assets/social.jpg'
import ScienceBook from '../../assets/science.jpg'
import HistoryBook from '../../assets/history.webp'
import MoralBook from '../../assets/moral.jpg'

export default function ExamStorageComponent() {
    const [selectedSubject, setSelectedSubject] = useState('국어');
    const [examList, setExamList] = useState([]);
    const [isLoading2, setIsLoading2] = useState(false);
    const loginState = useSelector(state => state.loginSlice);
    const email = loginState.email;

    useEffect(() => {
        setIsLoading2(true);
        jwtAxios.get(`https://bsherpa.duckdns.org/exams?email=${email}&subjectName=${selectedSubject}`)
            .then((response) => {
                const validExams = response.data.getExamResponses?.filter(exam => 
                    exam && exam.subjectName === selectedSubject
                ) || [];
                setExamList(validExams);
            })
            .catch((error) => {
                console.error('Error loading exams:', error);
                setExamList([]);
            })
            .finally(() => {
                setIsLoading2(false);
            });
    }, [selectedSubject, email]);

    // 시험지를 3개씩 그룹화 (4개에서 3개로 변경)
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
            <Box sx={{ p: 4, minHeight: '100%' }}>  {/* padding 증가 */}
                <Toolbar />
                <Typography variant="h6" sx={{ marginBottom: 4 }}>  {/* margin 증가 */}
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
                    <Box sx={{ marginY: 4 }}>  {/* margin 증가 */}
                        <Grid 
                            container 
                            spacing={4}  // spacing 증가
                            sx={{ 
                                maxWidth: 1200,  // 최대 너비 설정
                                margin: '0 auto'  // 중앙 정렬
                            }}
                        >
                            {examList.map((exam) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    sm={6} 
                                    md={4}  // 3개씩 표시하도록 변경
                                    key={exam.id}
                                    sx={{ 
                                        display: 'flex',
                                        justifyContent: 'center'  // 카드 중앙 정렬
                                    }}
                                >
                                    <ExamCardComponent
                                        examId={exam.id}
                                        examName={exam.examName}
                                        className={exam.className}
                                        subjectName={exam.subjectName}
                                        grade={exam.grade}
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
