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
    const [selectedSubject, setSelectedSubject] = useState('국어'); // 선택된 과목 상태 추가
    const [examList,setExamList] = useState([]);
    const [isLoading2, setIsLoading2] = useState(false);
    const [subjectImage, setSubjectImage] = useState(KoreanBook); // 기본값을 국어 이미지로 설정
    const loginState = useSelector(state => state.loginSlice);
    const email = loginState.email;

    const { data: examData, isLoading } = useQuery({
        queryKey: ['email', email],
        queryFn: () => getExam(email),
        staleTime: 1000 * 3,
        enabled: !!email
    });
    // 과목이 변경될 때마다 해당 과목의 시험지 데이터를 가져옴
    useEffect(() => {
        setIsLoading2(true);
        jwtAxios.get(`https://bsherpa.duckdns.org/exams?email=${email}&subjectName=${selectedSubject}`)
            .then((response) => {
                   // 응답 데이터의 유효성 검사
                   const validExams = response.data.getExamResponses?.filter(exam => 
                    exam && exam.subjectName === selectedSubject
                ) || [];
                
                console.log(`${selectedSubject} 과목 필터링된 시험 데이터:`, validExams);
                
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

    

    const exams = examData?.getExamResponses || [];
  // 선택된 과목에 따라 시험지 필터링
  const filteredExams = exams.filter(exam => exam.subjectName === selectedSubject);

  // 필터링된 시험지를 4개씩 그룹화
  const groupedExams = [];
  for (let i = 0; i < filteredExams.length; i += 4) {
      groupedExams.push(filteredExams.slice(i, i + 4));
  }

  // 과목 선택 핸들러
  const handleSubjectChange = (subject) => {
      setSelectedSubject(subject);
      setExamList([]);
  };


       return (
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
            <Toolbar />
            <Typography variant="h6" sx={{ marginBottom: 3 }}>
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
                <Box sx={{ marginBottom: 2, marginTop: 2 }}>
                    {groupedExams.map((group, groupIndex) => (
                        <Grid container spacing={2} key={groupIndex} sx={{ marginBottom: 2 }}>
                            {group.map((exam) => (
                                <Grid item xs={12} sm={6} md={3} key={exam.id}>
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
                    ))}
                </Box>
            ) : (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '200px'
                }}>
                    <Typography variant="body1">
                        {selectedSubject} 과목의 시험지가 없습니다.
                    </Typography>
                </Box>
            )}
        </Box>
    );

}