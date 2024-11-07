import { useEffect, useRef, useState } from 'react';
import Button from "@mui/material/Button";
import CommonResource from "../../util/CommonResource.jsx";
import { getExamTest } from "../../api/step4Api.js";
import {Image} from "@mui/icons-material";

const Step4ComponentQuestion = ({ examId }) => {
    const [response, setResponse] = useState(null); // API 응답 데이터를 상태로 관리
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const pdfRef = useRef();

    const getOptionNumber = (number) => {
        const numbers = ["①", "②", "③", "④", "⑤"];
        return numbers[number - 1] || number; // 1부터 시작하는 번호를 ①, ②로 변환
    };

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
          padding: 5px;
          background-color: white;
          color: black;
        }
        
      @media print {
        body {
          /*display: block;*/
        }
      }
      @media screen {
        body {
          display: none;
          /*width: 80%;*/
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
                marginBottom: "45px"
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

            const extractTdContent = (htmlString) => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlString;
                const tdElement = tempDiv.querySelector('td');
                if (tdElement) {
                    return tdElement.innerHTML;  // Return the HTML inside <td>
                }
                return '';
            };

            // 지문은 번호를 매기지 않고 그냥 출력, 문제만 순차적으로 번호 매기기
            let contentHtml = [];

            if (passages.length > 0) {
                // 지문을 그냥 출력 (번호 매기지 않음)
                passages.forEach((passage, passageIndex) => {
                    const tdContent = extractTdContent(passage.html);
                    contentHtml.push(
                        <div key={`passage-${collectionIndex}-${passageIndex}`}
                             style={{marginLeft: '15px', marginTop: ''}}>
                            <div style={{marginBottom:'10px'}}>다음 지문을 읽고 질문에 답하시오.</div>
                            <div style={{border:'solid 1px lightgrey', borderRadius:'5px',padding:'30px 15px'}} dangerouslySetInnerHTML={{__html: tdContent}}/>
                        </div>
                    );
                });
            }

            if (questions.length > 0) {
                // 문제는 순차적으로 번호 매기기
                questions.forEach((question, questionIndex) => {
                    contentHtml.push(
                        <div key={`question-${collectionIndex}-${questionIndex}`}
                             style={{display: 'inline-flex', marginTop: '30px', marginBottom: '30px'}}>
                            <div style={{display: 'inline', fontWeight: 'bold', marginLeft: '15px'}}>
                                {questionCounter}.
                            </div>
                            &nbsp;
                            {/* 객관식 문제일 경우 (subjective가 false인 경우) */}
                            {question.subjective === false ? (
                                <div style={{display: 'inline'}}>
                                    <div style={{marginBottom: '18px'}}
                                         dangerouslySetInnerHTML={{__html: question.html}}/>
                                    <div>
                                        {/* 보기를 나열 */}
                                        {question.getOptionsResponse?.getOptiosResponses.map((option, index) => (
                                            <div key={`option-${questionCounter}-${index}`}
                                                 style={{display: 'flex', paddingLeft: '10px', marginBottom: '8px'}}>
                                                <div>{getOptionNumber(option.optionNo)}</div>
                                                &nbsp;
                                                <div dangerouslySetInnerHTML={{__html: option.html}}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // 주관식 문제일 경우 (subjective가 true인 경우)
                                <div style={{display: 'inline'}}>
                                    <div dangerouslySetInnerHTML={{__html: question.html}}/>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="정답을 입력하세요"
                                            style={{marginLeft: '10px', border: '1px solid gray', padding: '5px'}}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                    questionCounter++; // 문제 번호 증가
                });
            }
            return <div key={`collection-${collectionIndex}`}>{contentHtml}</div>;
        });
        return (
            <div>
                {examHeader}
                {allContentHtml}
            </div>
        );
    };

    return (
        <>
            <CommonResource/>
            <Button onClick={handlePrint} variant="contained" color="error">문제</Button>
            <div ref={pdfRef}
                 style={{textAlign: 'left', padding: '20px', backgroundColor: 'aliceblue', display: 'none'}}>
                {renderContent()}
            </div>
        </>
    );
};

export default Step4ComponentQuestion;
