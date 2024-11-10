import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";

import Step4ComponentQuestion from "../step/Step4ComponentQuestion.jsx";
import Step4ComponentAnswer from "../step/Step4ComponentAnswer.jsx";
import Step4ComponentAll from "../step/Step4ComponentAll.jsx";

import KoreanBook from "../../assets/korean.jpg";
import MathBook from '../../assets/math.jpg';
import EnglishBook from '../../assets/english.png';
import SocialBook from '../../assets/social.jpg';
import ScienceBook from '../../assets/science.jpg';
import HistoryBook from '../../assets/history.webp';
import MoralBook from '../../assets/moral.jpg';

export default function ExamCardComponent({examId, subjectName, examName, grade, onModifyButtonClick}) {

    const getSubjectImage = (subject) => {
        switch (subject) {
            case '국어':
                return KoreanBook;
            case '수학':
                return MathBook;
            case '영어':
                return EnglishBook;
            case '사회':
                return SocialBook;
            case '과학':
                return ScienceBook;
            case '역사':
                return HistoryBook;
            case '도덕':
                return MoralBook;
            default:
                return KoreanBook;
        }
    };

    const handleModifyClick = () => {
        if (onModifyButtonClick) {
            onModifyButtonClick(examId);  // 부모 컴포넌트로 examId 전달
        }
    };

    const handleClickLoadExamPage = () => {
        window.open("https://exsherpa.com", "_blank");
    };

    return (
        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                sx={{ height: 140, backgroundSize: 'cover', backgroundPosition: 'center' }}
                image={getSubjectImage(subjectName)}
                title={`${subjectName} 교과서 이미지`}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {examName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {subjectName} {grade}
                </Typography>
            </CardContent>
            <CardActions>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    {/* PDF 출력 버튼을 Step4Component로 처리 */}
                    <Step4ComponentQuestion examId={examId}/>

                    {/* 다른 버튼들 */}
                    <Step4ComponentAnswer examId={examId}/>
                    <Step4ComponentAll examId={examId}/>
                </ButtonGroup>
                <Button size="small" onClick={handleModifyClick}>수정하기</Button>
                <Button size="small" onClick={handleClickLoadExamPage}>온라인 시험지 보기</Button>
            </CardActions>
        </Card>
    );
}