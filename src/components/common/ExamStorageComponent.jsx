import {useSelector} from "react-redux";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {useQuery} from "@tanstack/react-query";
import {getExam} from "../../api/mainApi.js";
import {CircularProgress} from "@mui/material";
import ExamCardComponent from "./ExamCardComponent.jsx";

export default function ExamStorageComponent() {
    const loginState = useSelector(state=> state.loginSlice)
    const email = loginState.email;

    const {data: examData, isLoading} = useQuery ({
        queryKey: ['email', email],
        queryFn: () => getExam(email),
        staleTime: 1000 * 3,
        enabled: !!email
    });

    const exams = examData?.getExamResponses || [];
    console.log("examData: ", examData);

    return (
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
            <Toolbar />

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                // 로딩이 끝나고 데이터가 있으면 Card로 Exam 표시
                exams.length > 0 ? (
                    <Box sx={{ marginBottom: 2, marginTop: 2 }}>
                        <Typography variant="h6">{exams[0].username}님의 시험지 보관함</Typography>
                        {exams.map((exam, index) => (
                            <Box key={index} sx={{ display: 'flex', gap: 2, marginBottom: 2, marginTop: 2 }}>
                                <ExamCardComponent
                                    key={exam.id}
                                    examId={exam.id}
                                    examName={exam.examName}
                                    className={exam.className}
                                    subjectName={exam.subjectName}
                                    grade={exam.grade}
                                />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    // 데이터가 없을 때 보여줌
                    <Typography variant="body1">{examData[0]?.username}님이 작성한 시험지가 없습니다.</Typography>
                )
            )}
        </Box>
    );
}