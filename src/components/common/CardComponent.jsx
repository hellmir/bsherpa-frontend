import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useCustomMove from "../../hooks/useCustomMove.jsx";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";
import ModalComponent from "./ModalComponent.jsx";
import React, {useState} from "react";
import KoreanBook from '../../assets/korean.jpg'
import MathBook from '../../assets/math.jpg'
import EnglishBook from '../../assets/english.png'
import SocialBook from '../../assets/social.jpg'
import ScienceBook from '../../assets/science.jpg'
import HistoryBook from '../../assets/history.webp'
import MoralBook from '../../assets/moral.jpg'


export default function CardComponent({bookName, bookId, author}) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const {isLogin} = useCustomLogin();
    const {moveToStepWithData} = useCustomMove()

    const handleClickCreate = () => {
        if (!isLogin) {
            setIsLoginModalOpen(true);
            return;
        }
        moveToStepWithData(`step0`, {id: bookId, name: bookName, author})
    }

    const handleCloseLoginModal = () => {
        setIsLoginModalOpen(false);
    };

   // 과목별 이미지 매핑 함수
   const getSubjectImage = (name) => {
    if (name.includes('국어')) return KoreanBook;
    if (name.includes('수학')) return MathBook;
    if (name.includes('영어')) return EnglishBook;
    if (name.includes('사회')) return SocialBook;
    if (name.includes('과학')) return ScienceBook;
    if (name.includes('역사')) return HistoryBook;
    if (name.includes('도덕')) return MoralBook;
    return KoreanBook; // 기본 이미지
};

    return (
        <Card sx={{
            maxWidth: 270,
            width: '100%',
            height: '100%'
        }}>
            <CardMedia
                sx={{height: 140}}
                image={getSubjectImage(bookName)}  
                title="cat"
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {bookName}
                </Typography>
                <Typography variant="body2" sx={{color: 'text.secondary'}}>
                    {author}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
                <Button size="small" onClick={handleClickCreate}>시험지 만들기</Button>
            </CardActions>
            <ModalComponent
                title="로그인 정보 없음"
                content={
                    <>로그인 후 이용해 주세요</>
                }
                handleClose={handleCloseLoginModal}
                open={isLoginModalOpen}
            />
        </Card>
    );
}
