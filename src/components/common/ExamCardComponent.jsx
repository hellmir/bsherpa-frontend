import useCustomMove from "../../hooks/useCustomMove.jsx";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import koreanBook from "../../assets/korean.jpg";
import Step4Component from "../step/Step4Component.jsx";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function ExamCardComponent({examId, subjectName, examName, grade}) {

    const handleClickLoadExamPage = () => {
        window.open("https://exsherpa.com", "_blank");
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={koreanBook}
                title="cat"
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
                    <Step4Component examId={examId}/>

                    {/* 다른 버튼들 */}
                    <Step4Component examId={examId}/>
                    <Step4Component examId={examId}/>
                </ButtonGroup>
                <Button size="small" onClick={handleClickLoadExamPage}>온라인 시험지 보기</Button>
            </CardActions>
        </Card>
    );
}









