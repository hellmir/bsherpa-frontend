import useCustomMove from "../../hooks/useCustomMove.jsx";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import koreanBook from "../../assets/국어책.jpg";

export default function ExamCardComponent({examId, subjectName, examName, grade}) {
    const {moveToStepWithData} = useCustomMove();

    const handleClickLoadPdf = (event) => {
        console.log("clicked examId: ",examId);

        moveToStepWithData(`step4`, examId);
    }

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
                <Button size="small" onClick={handleClickLoadPdf}>시험지 다운로드</Button>
                <Button size="small" onClick={handleClickLoadExamPage}>온라인 시험지 보기</Button>
            </CardActions>
        </Card>
    );
}
