import { useEffect, useRef, useState } from 'react';
import Button from "@mui/material/Button";
import CommonResource from "../../util/CommonResource.jsx";
import { getExamTest } from "../../api/step4Api.js";
import katex from "katex"; // KaTeX import

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
                const data = await getExamTest(examId); // API에서 데이터 받아오기
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

    // 수식을 KaTeX로 렌더링
    const renderMath = (mathString) => {
        if (mathString) {
            try {
                // 수식에서 \(\) 또는 \displaystyle 같은 불필요한 문법을 제거
                let cleanedMathString = mathString
                    // \(\)와 \displaystyle 등을 제거
                    .replace(/\\\(\s*/g, '')   // \(\ 제거
                    .replace(/\s*\\\)/g, '')   // \) 제거
                    .replace(/\\displaystyle\s*/g, '');  // \displaystyle 제거

                cleanedMathString = cleanedMathString
                    .replace(/\{\{\s*/g, '{')    // {{ 을 { 으로 변경
                    .replace(/\s*\}\}/g, '}')    // }} 을 } 으로 변경
                    .replace(/\{\s*\{/g, '{')    // 중복된 { 제거
                    .replace(/\}\s*\}/g, '}');   // 중복된 } 제거

                // 불필요한 공백 제거 및 양쪽 공백 정리
                cleanedMathString = cleanedMathString.replace(/\s+/g, ' ').trim();

                console.log("정리된 수식: ", cleanedMathString); // 정리된 수식 확인

                // KaTeX 렌더링
                return katex.renderToString(cleanedMathString, {
                    throwOnError: false, // 오류가 나면 그냥 표시
                });
            } catch (error) {
                console.error("수식 렌더링 오류: ", error);
                return ''; // 오류가 나면 빈 문자열 반환
            }
        }
        return ''; // 수식이 없다면 빈 문자열 반환
    };


    // 수식을 렌더링할 수 있게 하는 함수
    const renderQuestionWithMath = (html) => {
        // 먼저 수식을 포함한 html을 그대로 렌더링
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 수식이 있는 부분에 KaTeX 적용
        const mathElements = tempDiv.querySelectorAll('.latex_equation'); // class="latex_equation"인 요소 찾기

        mathElements.forEach(element => {
            const mathString = element.textContent || element.innerText; // 수식 텍스트 가져오기
            console.log("수식 html: ", mathString);
            const renderedMath = renderMath(mathString); // 수식 렌더링
            console.log("수식 렌더링 완료: ", renderedMath);
            element.innerHTML = renderedMath; // 수식을 KaTeX로 변환하여 삽입
        });

        return tempDiv.innerHTML;
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
                            <div style={{border:'solid 1px lightgrey', borderRadius:'5px',padding:'30px 15px'}}
                                 dangerouslySetInnerHTML={{__html: renderQuestionWithMath(tdContent)}} />
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
                                         dangerouslySetInnerHTML={{
                                             __html: renderQuestionWithMath(question.html)
                                         }} />
                                    <div>
                                        {/* 보기를 나열 */}
                                        {question.getOptionsResponse?.getOptiosResponses.map((option, index) => (
                                            <div key={`option-${questionCounter}-${index}`}
                                                 style={{display: 'flex', paddingLeft: '10px', marginBottom: '8px'}}>
                                                <div>{getOptionNumber(option.optionNo)}</div>
                                                &nbsp;
                                                <div dangerouslySetInnerHTML={{
                                                    __html: renderQuestionWithMath(option.html)
                                                }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                // 주관식 문제일 경우 (subjective가 true인 경우)
                                <div style={{display: 'inline'}}>
                                    <div dangerouslySetInnerHTML={{
                                        __html: renderQuestionWithMath(question.html)
                                    }} />
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
            <CommonResource />
            <Button onClick={handlePrint} variant="contained" color="error">문제</Button>
            <div ref={pdfRef}
                 style={{textAlign: 'left', padding: '20px', backgroundColor: 'aliceblue', display:'none'}}>
                {renderContent()}
            </div>
        </>
    );
};

export default Step4ComponentQuestion;
