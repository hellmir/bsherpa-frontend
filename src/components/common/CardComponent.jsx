import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function CardComponent() {
  return (
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
            sx={{ height: 140 }}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            수학 1-1
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
       홍길동
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">시험지 만들기</Button>
          <Button size="small">평가 자료 다운</Button>
        </CardActions>
      </Card>
  );
}
