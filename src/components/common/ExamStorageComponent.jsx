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
import { useState } from 'react';


export default function ExamStorageComponent() {
    const [selectedSubject, setSelectedSubject] = useState('국어'); // 선택된 과목 상태 추가

    const loginState = useSelector(state => state.loginSlice);
    const email = loginState.email;

    const { data: examData, isLoading } = useQuery({
        queryKey: ['email', email],
        queryFn: () => getExam(email),
        staleTime: 1000 * 3,
        enabled: !!email
    });
   
    selectedSubject
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
  };
    // Group exams into arrays of 4
  
    for (let i = 0; i < exams.length; i += 4) {
        groupedExams.push(exams.slice(i, i + 4));
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
            <Toolbar />
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                exams.length > 0 ? (
                    <Box sx={{ marginBottom: 2, marginTop: 2 }}>
                              

                        <Typography variant="h6" sx={{ marginBottom: 3 }}>
                            {exams[0].username}님의 시험지 보관함
                        </Typography>
                        <CustomMainSelectComponent subjectName={ selectedSubject }
                         onSubjectChange={handleSubjectChange} /> 
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
                    <Typography variant="body1">
                        {examData[0]?.username}님이 작성한 시험지가 없습니다.
                    </Typography>
                )
            )}
        </Box>
    );
}