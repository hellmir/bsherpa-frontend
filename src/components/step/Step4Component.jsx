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
            try{
                setIsLoading(true); // 로딩 시작
                const data = await getExamTest(); //API에서 데이터 받아오기
                console.log("ID에 따라 받아온 데이터: ", data);
                // console.log("시험지 아이디: ", data.);

                setResponse(data); // 응답 데이터 상태에 저장
                console.log("setResponse 호출됨");
            }catch(error){
                console.error("데이터 로딩 실패: ", error);
            }finally{
                setIsLoading(false); // 로딩 끝
            }
        };
        fetchData();
    }, []); // 빈 배열을 전달하여 한 번만호출되도록 설정

    // API 호출 후, response 값이 제대로 세팅되었는지 로그 확인 // response 값이 변경될 때마다 콘솔 찍기
    useEffect(() => {
        console.log("현재 response 상태:", response);
    }, [response]);





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
        margin-bottom: 30px;
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
        printWindow.print("", {filename:"내가 만든 시험지"});

        // 인쇄 후 창 닫기
        printWindow.close();
    };

    // response 데이터를 사용하여 정보 표시

    const indicators = ['①', '②', '③', '④', '⑤'];

    // const renderContent = () => {
    //     if(!response) return <div>Loading...</div>; // 데이터 로딩 중 표시
    //
    //     const sections = [];
    //     response.collection.map((item, index) => {
    //
    //         // 지문 추가
    //         sections.push(
    //             <div key={`passage-${index}`} style={{marginBottom: '50px'}}>
    //                 <div style={{fontWeight:"bold", marginLeft:"15px"}}>[ 1 ~ 3 ] 다음 지문을 읽고 질문에 답하시오. (5점)</div>
    //                 <div dangerouslySetInnerHTML={{__html: item.passage.passageHtml}}/>
    //             </div>
    //         );
    //
    //         // 각 질문에 대해 처리
    //         item.questions.forEach((question, qIndex) => {
    //             sections.push(<div key={`section-${index}-${qIndex}`} style={{marginBottom: '30px'}}/>);
    //
    //             // 질문을 현재 섹션에 추가
    //             sections.push(
    //                 <div key={`question-${index}-${qIndex}`} style={{margin: "0 10px 80px 10px"}}>
    //                     <div style={{display: 'inline-block', fontWeight: 'bold'}}>
    //                         {qIndex + 1}.
    //                     </div>
    //                     &nbsp;
    //                     <div
    //                         style={{display: 'inline-block', marginBottom: '30px', verticalAlign: 'top'}}
    //                         dangerouslySetInnerHTML={{__html: question.questionHtml}}
    //                     />
    //
    //                     {/*보기 추가*/}
    //                     {question.questionType === '객관식' ? (
    //                         question.options.map((option, optIndex) => (
    //                             <div key={`option-${index}-${qIndex}-${optIndex}`}
    //                                  style={{marginBottom: '15px', display: 'flex'}}>
    //                                 <div>{indicators[optIndex]}</div>
    //                                 &nbsp; {/* 인덱스 기호 추가 */}
    //                                 <div dangerouslySetInnerHTML={{__html: option[`choice${optIndex + 1}Html`]}}/>
    //                             </div>
    //                         ))
    //                     ) : (
    //                         <div style={{border: "solid 1px lightgrey", width: "60%", height: "150px", padding: "10px"}}>
    //                             <span> 정답 : </span>
    //                         </div>
    //                     )}
    //                 </div>
    //             );
    //         });
    //     });
    //
    //     return sections;
    // };

    return (
        <>
            <CommonResource/>
            <Button onClick={handlePrint} variant="contained">문제만</Button>
            <div ref={pdfRef} style={{textAlign: 'left', padding: '20px', backgroundColor: 'aliceblue'}}>
                {isLoading ? (
                    <div>Loading...</div>  // 로딩 중일 때 표시
                ) : (
                    <div>응답 데이터 ID: {response?.id || "응답 없음"}</div>  // 데이터가 준비되면 출력
                )}
            </div>
        </>
    );
};

export default Step4Component;