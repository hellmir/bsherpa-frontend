import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Button from "@mui/material/Button";

//나중에 컴포넌트로 바꾸면될듯
const Step4Component = ({response}) => {

    const handleDownload = async () => {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '-9999px'; // 화면에서 보이지 않도록 위치 조정
        element.style.width = '210mm'; // A4 용지 폭
        element.style.height = '594mm'; // A4 용지 높이

        // 시험지 내용을 element에 추가
        let content = `<h1>시험지</h1>`;

        response.itemList.forEach(item => {
            if(item.passageId){
                content += `
<!--                지문 파트 -->
<!-- 겹치는 지문 있을 때 처리 -->
                <div style="margin-bottom: 20px; padding: 10px;">
                ${item.passageHtml}
                </div>


<!--                문제 파트-->
                <div style="margin-bottom: 20px; padding: 10px;">
                    <p><p style="font-weight: bold">${item.itemNo}.</p>${item.questionHtml}</p>
                    ① ${item.choice1Html}
                    ② ${item.choice2Html}
                    ③ ${item.choice3Html}
                    ④ ${item.choice4Html}
                    ⑤ ${item.choice5Html}
                    <p><strong>설명:</strong> ${item.explainHtml}</p>
                </div>
            `;
            }else{
                content += `
                <div style="margin-bottom: 20px; border: solid 2px; padding: 10px;">
                    <p><p style="font-weight: bold">${item.itemNo}.</p>${item.questionHtml}</p>
                    ① ${item.choice1Html}
                    ② ${item.choice2Html}
                    ③ ${item.choice3Html}
                    ④ ${item.choice4Html}
                    ⑤ ${item.choice5Html}
                    <p><strong>설명:</strong> ${item.explainHtml}</p>
                </div>
            `;
            }

        });

        element.innerHTML = content;
        document.body.appendChild(element);

        try {
            const canvas = await html2canvas(element, { useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();

            const imgWidth = 90;
            const pageHeight = pdf.internal.pageSize.height;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('exam.pdf');
        } catch (error) {
            console.error('PDF 생성 중 오류 발생:', error);
        } finally {
            // 생성한 element를 제거
            document.body.removeChild(element);
        }
    };

    return (
        <div>
            <Button onClick={handleDownload}>시험지 다운로드</Button>
        </div>
    );
};

export default Step4Component;
