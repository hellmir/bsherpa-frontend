import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Button from "@mui/material/Button";

const Step4Component = ({ response }) => {
    const handleDownload = async () => {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        //element.style.left = '-9999px'; // 화면에서 보이지 않도록 위치 조정

        // 시험지 내용을 element에 추가
        let content = `<h1 style="text-align: center;">시험지</h1>
                                <div style="display: flex; flex-wrap: wrap;">`;
        response.itemList.forEach(item => {
            content += `
                <div style="width: 50%; padding: 10px; box-sizing: border-box;">
                    <div style="margin-bottom: 20px; padding: 10px;">
                        ${item.passageId ? item.passageHtml : ''}
                    </div>
                    <div style="padding: 10px; margin-bottom: 20px;">
                        <span style="font-weight: bold;">${item.itemNo}.</span>
                        <span>${item.questionHtml}</span>
                        <span> ① ${item.choice1Html}</span>
                        <span> ② ${item.choice2Html}</span>
                        <span> ③ ${item.choice3Html}</span>
                        <span> ④ ${item.choice4Html}</span>
                        <span> ⑤ ${item.choice5Html}</span>
                        <span><strong>설명:</strong> ${item.explainHtml}</span>
                    </div>
                </div>
            `;
        });

        content += `</div>`; // flex 컨테이너 닫기
        element.innerHTML = content;
        document.body.appendChild(element);

        try {
            const canvas = await html2canvas(element, { useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgWidth = 210; // A4 width in mm
            const pageHeight = pdf.internal.pageSize.height; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // 이미지 비율에 맞게 높이 계산

            let heightLeft = imgHeight;
            let position = 0;

            // 첫 페이지에 이미지 추가
            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, Math.min(imgHeight, pageHeight));
                heightLeft -= pageHeight; // 다음 페이지로 넘어갈 때 남은 높이에서 페이지 높이 감소

                if (heightLeft > 0) {
                    pdf.addPage(); // 페이지 추가
                }
                position = 0; // 다음 페이지에서 항상 위에서 시작
            }

            //pdf.save('exam.pdf');
        } catch (error) {
            console.error('PDF 생성 중 오류 발생:', error);
        } finally {
            // 생성한 element를 제거
            //document.body.removeChild(element);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleDownload}>
                시험지 다운로드
            </Button>
        </div>
    );
};

export default Step4Component;
