import useCustomMove from "../../hooks/useCustomMove.jsx";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import KoreanBook from "../../assets/korean.jpg";
import MathBook from '../../assets/math.jpg';
import EnglishBook from '../../assets/english.png';
import SocialBook from '../../assets/social.jpg';
import ScienceBook from '../../assets/science.jpg';
import HistoryBook from '../../assets/history.webp';
import MoralBook from '../../assets/moral.jpg';
import {useEffect, useRef, useState} from "react";
import {getExamTest} from "../../api/step4Api.js";
import Step4Component from "../step/Step4Component.jsx";

export default function ExamCardComponent({examId, subjectName, examName, grade}) {
    const {moveToStepWithData} = useCustomMove();

    // 과목별 이미지 매핑 함수
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

    const handleClickLoadExamPage = () => {
        window.open("https://exsherpa.com", "_blank");
    }

    return (
        <Card sx={{ 
            maxWidth: 345,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <CardMedia
                sx={{ 
                    height: 140,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
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
            <CardActions sx={{ 
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 16px'
            }}>
                <Step4Component examId={examId}/>
                <Button size="small" onClick={handleClickLoadExamPage}>
                    온라인 시험지 보기
                </Button>
            </CardActions>
        </Card>
    );
}