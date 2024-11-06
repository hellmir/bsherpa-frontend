import {useEffect, useRef, useState} from 'react';
import Button from "@mui/material/Button";
import CommonResource from "../../util/CommonResource.jsx";
import {getExamTest} from "../../api/step4Api.js";

const Step4Component = () => {

    const [response, setResponse] = useState(null); // API 응답 데이터를 상태로 관리
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태

    const pdfRef = useRef();

    // 데이터 로드: 컴포넌트가 마운트 될 때 API 호출
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true); // 로딩 시작
                const data = await getExamTest(); //API에서 데이터 받아오기
                // console.log("ID에 따라 받아온 데이터: ", data);
                // console.log("ID: ", data.id);

                setResponse(data); // 응답 데이터 상태에 저장

            } catch (error) {
                console.error("데이터 로딩 실패: ", error);
            } finally {
                setIsLoading(false); // 로딩 끝
            }
        };
        fetchData();
    }, []); // 빈 배열을 전달하여 한 번만호출되도록 설정


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
        printWindow.print("", {filename: "내가 만든 시험지"});

        // 인쇄 후 창 닫기
        printWindow.close();
    };

    // response 데이터를 사용하여 정보 표시

    const indicators = ['①', '②', '③', '④', '⑤'];

    const renderContent = () => {
        if (isLoading) return <div>Loading...</div>; // 로딩 중 표시
        if (!response) return <div>데이터가 없습니다.</div>;

        const examHeader = [];
        examHeader.push(
            <>
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
                    }}>{response.examName}</h1>
                    <div className="examinee" style={{
                        width: "25%",
                        height: "80px",
                        outline: "none",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-evenly"
                    }}>
                        <input style={{border: "none", outline: "none", margin: "0 5px"}}
                               placeholder="           학년        반        번"/>
                        <input style={{border: "none", outline: "none", margin: "0 5px"}}
                               placeholder="이름 :   "/>
                    </div>
                </div>
                <div className="paper" style={{}}>
                    <div>{response.className}</div>
                </div>
            </>
        )
        // 콜렉션에서 지문과 문제 정보 추출
        const collections = response.getCollectionsResponse?.getCollectionResponses || [];
        // console.log(collections);

        const examSection = collections.map((collection, collectionIndex) => {
            // 각 콜렉션에서 지문이 있는지 확인
            const passages = collection.getPassagesResponse || [];
            //console.log(passages);
            console.log("지문: ", passages.getPassageResponses)

            const questions = collection.getQuestionsResponse || [];
            //console.log(questions);

            // 지문 HTML을 저장할 변수
            let passageHtml = "";

            // 지문이 있으면 HTML을 추출
            if (passages.length > 0) {
                // console.log(passages);
                passageHtml = passages.map((passage, passageIndex) => {
                    console.log("지문: ", passage.html);  // passage의 html을 콘솔에 출력
                    return (
                        <div key={passageIndex} dangerouslySetInnerHTML={{ __html: passage.html }} />
                    );
                });
                return { passages: passageHtml };  // 결과 반환
            }
            console.log("지문 길이가 항상 0?");

        });

        return <div>
                    {examHeader}
                    {examSection}
                </div>;
    };


    return (
        <>
            <CommonResource/>
            <Button onClick={handlePrint} variant="contained">문제만</Button>
            <div ref={pdfRef} style={{textAlign: 'left', padding: '20px', backgroundColor: 'aliceblue'}}>
                {renderContent()}
            </div>
        </>
    );
};

export default Step4Component;