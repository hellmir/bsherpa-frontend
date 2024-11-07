import useCustomMove from "../../hooks/useCustomMove.jsx";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import koreanBook from "../../assets/korean.jpg";
import {useEffect, useRef, useState} from "react";
import {getExamTest} from "../../api/step4Api.js";

export default function ExamCardComponent({examId, subjectName, examName, grade}) {
    const {moveToStepWithData} = useCustomMove();

    // console.log(examId)

    const [response, setResponse] = useState(null); // API 응답 데이터를 상태로 관리
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const pdfRef = useRef();

    // 데이터 로드: 컴포넌트가 마운트 될 때 API 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true); // 로딩 시작
                const data = await getExamTest(examId); //API에서 데이터 받아오기
                setResponse(data); // 응답 데이터 상태에 저장
            } catch (error) {
                console.error("데이터 로딩 실패: ", error);
            } finally {
                setIsLoading(false); // 로딩 끝
            }
        };
        fetchData();
    }, [examId]); // examId가 변경될 때마다 다시 API 호출

    const handlePrint = () => {
        // 인쇄할 내용을 위한 새로운 HTML 생성
        const printContent = pdfRef.current.innerHTML;

        const printWindow = window.open('', '_blank');
        const printStyle = `
      <style>
        body {
          margin: 0;
          padding: 20px;
          background-color: white;
          color: black;
        }
        
      @media print {
        body {
          display: block;
        }
      }
      @media screen {
        body {
          display: none;
          width: 80%;
        }
      }
      </style>
    `;

        printWindow.document.write(`
            <html>
            <head>
              <title>시험지 출력</title>
              ${printStyle}
            </head>
            <body>
              ${printContent}
            </body>
            </html>
    `);
        printWindow.document.close();

        // 인쇄 대화상자 열기
        printWindow.print("", { filename: "내가 만든 시험지" });

        // 인쇄 후 창 닫기
        printWindow.close();
    };

    const renderContent = () => {
        if (isLoading) return <div>Loading...</div>; // 로딩 중 표시
        if (!response) return <div>데이터가 없습니다.</div>;

        const examHeader = (
            <div className="examHead" style={{
                height: "80px",
                display: "flex",
                border: "solid 3px lightgray",
                borderRadius: "20px",
                alignItems: "center",
                marginBottom: "30px"
            }}>
                <h1 className="examSubject" style={{
                    width: "75%",
                    height: "80px",
                    margin: "0 20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "solid 3px lightgray"
                }}>
                    {response.examName}
                </h1>
                <div className="examinee" style={{
                    width: "25%",
                    height: "80px",
                    outline: "none",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly"
                }}>
                    <input style={{ border: "none", outline: "none", margin: "0 5px" }} placeholder="           학년        반        번" />
                    <input style={{ border: "none", outline: "none", margin: "0 5px" }} placeholder="이름 :   " />
                </div>
            </div>
        );

        const collections = response.getCollectionsResponse?.getCollectionResponses || [];
        let questionCounter = 1; // 문제 번호를 순차적으로 증가시키기 위한 카운터

        const allContentHtml = collections.map((collection, collectionIndex) => {
            const passages = collection.getPassagesResponse?.getPassageResponses || [];
            const questions = collection.getQuestionsResponse?.getQuestionResponses || [];

            // 지문은 번호를 매기지 않고 그냥 출력, 문제만 순차적으로 번호 매기기
            let contentHtml = [];

            if (passages.length > 0) {
                // 지문을 그냥 출력 (번호 매기지 않음)
                passages.forEach((passage, passageIndex) => {
                    contentHtml.push(
                        <div key={`passage-${collectionIndex}-${passageIndex}`} dangerouslySetInnerHTML={{ __html: passage.html }} />
                    );
                });
            }

            if (questions.length > 0) {
                // 문제는 순차적으로 번호 매기기
                questions.forEach((question, questionIndex) => {
                    contentHtml.push(
                        <div key={`question-${collectionIndex}-${questionIndex}`}>
                            <strong>{questionCounter}. </strong>
                            <div dangerouslySetInnerHTML={{ __html: question.html }} />
                        </div>
                    );
                    questionCounter++; // 문제 번호 증가
                });
            }

            return <div key={collectionIndex}>{contentHtml}</div>;
        });

        return (
            <div>
                {examHeader}
                {allContentHtml}
            </div>
        );
    };

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
                <Button onClick={handlePrint} variant="contained">문제만</Button>
                <div ref={pdfRef} style={{ textAlign: 'left', padding: '20px', backgroundColor: 'aliceblue', display:'none'}}>
                    {renderContent()}
                </div>
                <Button size="small" onClick={handleClickLoadExamPage}>온라인 시험지 보기</Button>
            </CardActions>
        </Card>
    );
}
