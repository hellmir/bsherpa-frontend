import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Button from "@mui/material/Button";

const Step4ComponentBeta2 = ({ response }) => {
    const pdfRef = useRef();

    const generatePDF = async () => {
        const element = pdfRef.current;

        try {
            const canvas = await html2canvas(element, { useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 95; // 이미지 캡처할 때 너비
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // html 전체 길이 비율 맞춰 뽑기

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.height;

            while (heightLeft >= 0) {
                position = Math.max(heightLeft - imgHeight, 0); // 음수가 되지 않도록
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.height;
            }

            pdf.save('document.pdf');
        } catch (error) {
            console.error('PDF 생성 중 오류:', error);
        }
    };


    const renderContent = () => {
        const sections = [];
        let currentHeight = 0;

        response.collection.forEach((item, index) => {
            const passageHeight = calculateHeight(item.passage.passageHtml);
            console.log("지문 길이 (mm)", passageHeight);

            // 지문이 추가 가능한지 체크
            if (currentHeight + passageHeight > 270) {
                sections.push(<div key={`section-${index}`} style={{ marginBottom: '27mm' }} />);
                currentHeight = 0; // 높이 초기화
            }

            // 지문 추가
            sections.push(
                <div key={`passage-${index}`} style={{ marginBottom: '20px' }}>
                    <div dangerouslySetInnerHTML={{ __html: item.passage.passageHtml }} />
                </div>
            );
            currentHeight += passageHeight; // 현재 높이에 지문 추가

            // 각 질문에 대해 처리
            item.questions.forEach((question, qIndex) => {
                const questionHeight = calculateHeight(question.questionHtml) + 80; // 질문 높이 + 간격

                // 질문이 추가 가능한지 체크
                if (currentHeight + questionHeight > 270) {
                    sections.push(<div key={`section-${index}-${qIndex}`} style={{ marginBottom: '27mm' }} />);
                    currentHeight = 0; // 높이 초기화
                }

                // 질문을 현재 섹션에 추가
                sections.push(
                    <div key={`question-${index}-${qIndex}`} style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: 20 }}>{qIndex + 1}.</div>
                        <div style={{marginBottom: '15px'}} dangerouslySetInnerHTML={{ __html: question.questionHtml }} />
                        {question.questionType === '객관식' ? (
                            question.options.map((option, optIndex) => (
                                <div key={`option-${index}-${qIndex}-${optIndex}`} dangerouslySetInnerHTML={{ __html: option[`choice${optIndex + 1}Html`] }} style={{marginBottom: '5px'}}/>
                            ))
                        ) : (
                            <div>
                                <span>정답: </span>
                                <input type="text" />
                            </div>
                        )}
                        <div></div>
                    </div>
                );
                currentHeight += questionHeight; // 현재 높이에 질문 추가
            });
        });

        return sections;
    };


    const calculateHeight = (html) => {
        const div = document.createElement('div');
        div.innerHTML = html;
        document.body.appendChild(div);
        const heightInPixels = div.offsetHeight; // 픽셀 단위 높이
        document.body.removeChild(div);

        // 픽셀을 mm로 변환
        const heightInMM = heightInPixels / 3.779; // 1mm ≈ 3.779px
        return heightInMM;
    };

    return (
        <div>
            <Button onClick={generatePDF}>PDF 저장</Button>

            <div ref={pdfRef} style={{ textAlign: 'left', padding: '20px', backgroundColor: 'aliceblue' }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Step4ComponentBeta2;
