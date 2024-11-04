import {useRef} from 'react';
import Button from "@mui/material/Button";
import CommonResource from "../../util/CommonResource.jsx";

const Step4Component = ({response}) => {
    const pdfRef = useRef();

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
      
      .examHead{
        display: flex;
        border: solid 3px lightgray;
        border-radius: 20px;
        margin-bottom: 20px;
      }
      
      .examSubject{
        font-size: 50px;
        font-weight: bold;
        display: flex;
        justify-content: center;
        width: 75%;
        border-right: solid 3px lightgray;
      }
      .examinee{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        outline: none;
        width: 25%;
      }
      input{
        border: none;
        outline: none; /* 포커스 시 나타나는 윤곽선 제거 */
        margin: 0 5px;
      }
      
      </style>
    `;

        printWindow.document.write(`
      <html>
        <head>
          <title>시험지 저장</title>
          ${printStyle}
        </head>
        <body>
          <div class="examHead">
            <div class="examSubject">국어 1-1</div>
            <div class="examinee">
              <input placeholder="           학년        반        번"/>
              <input placeholder="이름 :   "/>
            </div>
          </div>
          <div>${printContent}</div>
        </body>
      </html>
    `);
        printWindow.document.close();

        // 인쇄 대화상자 열기
        printWindow.print();

        // 인쇄 후 창 닫기
        printWindow.close();
    };

    const indicators = ['①', '②', '③', '④', '⑤'];

    const renderContent = () => {
        const sections = [];
        response.collection.map((item, index) => {

            // 지문 추가
            sections.push(
                <div key={`passage-${index}`} style={{marginBottom: '50px'}}>
                    <div style={{fontWeight:"bold", marginLeft:"15px"}}>[ 1 ~ 3 ]</div>
                    <div dangerouslySetInnerHTML={{__html: item.passage.passageHtml}}/>
                </div>
            );

            // 각 질문에 대해 처리
            item.questions.forEach((question, qIndex) => {
                sections.push(<div key={`section-${index}-${qIndex}`} style={{marginBottom: '30px'}}/>);

                // 질문을 현재 섹션에 추가
                sections.push(
                    <div key={`question-${index}-${qIndex}`} style={{margin: "0 10px 80px 10px"}}>
                        <div style={{display: 'inline-block', fontWeight: 'bold'}}>
                            {qIndex + 1}.
                        </div>
                        &nbsp;
                        <div
                            style={{display: 'inline-block', marginBottom: '30px', verticalAlign: 'top'}}
                            dangerouslySetInnerHTML={{__html: question.questionHtml}}
                        />

                        {/*보기 추가*/}
                        {question.questionType === '객관식' ? (
                            question.options.map((option, optIndex) => (
                                <div key={`option-${index}-${qIndex}-${optIndex}`}
                                     style={{marginBottom: '15px', display: 'flex'}}>
                                    <div>{indicators[optIndex]}</div>
                                    &nbsp; {/* 인덱스 기호 추가 */}
                                    <div dangerouslySetInnerHTML={{__html: option[`choice${optIndex + 1}Html`]}}/>
                                </div>
                            ))
                        ) : (
                            <div style={{border: "solid 1px black", width: "100%", height: "50px"}}>
                                <span> 정답 : </span>
                            </div>
                        )}
                    </div>
                );
            });
        });

        return sections;
    };

    return (
        <>
            <CommonResource/>
            <Button onClick={handlePrint} variant="contained">문제만</Button>
            <div ref={pdfRef}
                 style={{textAlign: 'left', padding: '20px', backgroundColor: 'aliceblue', display: "none"}}>
                {renderContent()}
            </div>
        </>
    );
};

export default Step4Component;
