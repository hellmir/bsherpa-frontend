// src/Exam.js
import React from 'react';
import {jsPDF} from 'jspdf';
import {getItemDetails} from "../../api/step4Api.js";
import Button from "@mui/material/Button";

const Step4Page3 = () => {
    const handleDownload = async () => {
        try {
            // 0. API 요청
            const response = {
                "itemList": [
                    {
                        "itemNo": 1,
                        "itemId": 494519,
                        "questionFormCode": "50",
                        "questionFormName": "5지 선택",
                        "difficultyCode": "02",
                        "difficultyName": "하",
                        "largeChapterId": 115401,
                        "largeChapterName": "1. 새로운 시작",
                        "mediumChapterId": 11540101,
                        "mediumChapterName": "(1) 시의 아름다움",
                        "smallChapterId": 1154010101,
                        "smallChapterName": "포근한 봄",
                        "topicChapterId": 115401010101,
                        "topicChapterName": "작품의 특징",
                        "passageId": 24310,
                        "passage": "눈이 내린다봄이라서㉠봄빛처럼 포근한 눈 담장 위에 쌓이는 봄눈나무 위에 쌓이는 봄눈마당 위에 쌓이는 봄눈 그리고마루에서 졸다가 깬눈을 하고 앉은새끼 고양이의 눈 속에도내리는 봄눈 감았다 떴다 하는㉡새끼 고양이의 눈처럼보드라운봄봄 하늘봄 하늘의 봄눈",
                        "passageHtml": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \">\n    <table style=\"margin-left : 7px;padding-top : 4px;padding-left : 4px;display : inline-table;vertical-align : middle;width : 100%;padding-bottom : 4px;margin-top : 2px;margin-bottom : 2px;padding-right : 4px;margin-right : 7px;\">\n     <caption></caption>\n     <colgroup>\n      <col style=\"width: 100%\">\n     </colgroup>\n     <tbody>\n      <tr>\n       <td style=\"border-top:0.24mm solid; border-bottom:0.24mm solid; border-right:0.24mm solid; border-left:0.24mm solid; vertical-align : middle;\" colspan=\"1\" rowspan=\"1\">\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">눈이 내린다</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">봄이라서</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">㉠</span><span class=\"txt \" style=\"text-decoration : underline;\">봄빛처럼 포근한 눈</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">&nbsp; </span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">담장 위에 쌓이는 봄눈</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">나무 위에 쌓이는 봄눈</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">마당 위에 쌓이는 봄눈</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">&nbsp; </span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">그리고</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">마루에서 졸다가 깬</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">눈을 하고 앉은</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">새끼 고양이의 눈 속에도</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">내리는 봄눈</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">&nbsp; </span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">감았다 떴다 하는</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">㉡</span><span class=\"txt \" style=\"text-decoration : underline;\">새끼 고양이의 눈처럼</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">보드라운</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">봄</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">봄 하늘</span>\n        </div>\n        <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 14px;margin-left: 0px;margin-right: 0px;\">\n         <span class=\"txt \">봄 하늘의 봄눈</span>\n        </div></td>\n      </tr>\n     </tbody>\n    </table></span>\n  </div>\n </body>\n</html>",
                        "question": "이 시에 대한 감상으로 알맞지 않은 것은?",
                        "questionHtml": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \">이 시에 대한 감상으로 알맞지 </span><span class=\"txt \" style=\"text-decoration : underline;\">않은</span><span class=\"txt \"> 것은?</span>\n  </div>\n </body>\n</html>",
                        "choice1Html": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \"></span><span class=\"txt \">정윤: 이 시를 읽고 봄에 눈이 내리는 장면이 떠올랐어. </span>\n  </div>\n </body>\n</html>",
                        "choice2Html": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \"></span><span class=\"txt \">마음: 시를 읽는 내내 포근하고 평화로운 느낌이 들었어.</span>\n  </div>\n </body>\n</html>",
                        "choice3Html": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \"></span><span class=\"txt \">서현: 나는 봄눈을 바라보는 말하는 이의 쓸쓸한 처지에 공감이 갔어.</span>\n  </div>\n </body>\n</html>",
                        "choice4Html": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \"></span><span class=\"txt \">현용: ‘봄눈’을 다른 사물에 빗대 표현하여 더욱 생생한 느낌이 들었어. </span>\n  </div>\n </body>\n</html>",
                        "choice5Html": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \"></span><span class=\"txt \">정수: 소리는 같지만 뜻이 다른 글자인 ‘눈’으로 내용을 재미있게 표현하고 있어.</span>\n  </div>\n  <div class=\"paragraph\" style=\"border-left:0.24mm none;border-right:0.24mm none;border-top:0.24mm none;border-bottom:0.24mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \" style=\"text-decoration : underline;\"></span>\n  </div>\n </body>\n</html>",
                        "answer": "3",
                        "answerHtml": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \">③</span>\n  </div>\n </body>\n</html>",
                        "explain": "이 시에서는 봄눈이 주는 포근하고 부드러운 느낌을 바탕으로 따뜻하고 아름다운 봄날의 분위기를 느낄 수 있다. ",
                        "explainHtml": "<html>\n <head></head>\n <body>\n  <div class=\"paragraph\" style=\"border-left:0.2mm none;border-right:0.2mm none;border-top:0.2mm none;border-bottom:0.2mm none;text-indent: 0px;margin-left: 0px;margin-right: 0px;\">\n   <span class=\"txt \">이 시에서는 봄눈이 주는 포근하고 부드러운 느낌을 바탕으로 따뜻하고 아름다운 봄날의 분위기를 느낄 수 있다. </span>\n  </div>\n </body>\n</html>"
                    },
                ],
                "successYn": "Y"
            }//await getItemDetails(); // API 엔드포인트를 여기에 입력하세요.
            //console.log("응답 데이터: ", response);

            // 1. PDF 생성
            const doc = new jsPDF();

            // 2. 기본 Y 좌표 설정
            let currentY = 10; // PDF의 시작 Y 좌표

            // 3. PDF에 제목 추가
            doc.text("시험지", 10, currentY);
            currentY += 10; // 제목 높이만큼 Y 좌표 이동

            // 4. 응답 데이터 처리
            response.itemList.forEach((item, index) => {
                // 5. 문제 추가
                doc.text(`문제 ${index + 1}:`, 10, currentY);
                currentY += 10; // 문제 높이만큼 Y 좌표 이동

                const passage = item.passageHtml.replace(/<\/?[^>]+(>|$)/g, ""); // HTML 태그 제거
                doc.text(passage, 10, currentY);
                currentY += 10; // 패시지 높이만큼 Y 좌표 이동

                // 6. 질문 추가
                doc.text("질문:", 10, currentY);
                currentY += 10; // 질문 높이만큼 Y 좌표 이동

                const question = item.questionHtml.replace(/<\/?[^>]+(>|$)/g, ""); // HTML 태그 제거
                doc.text(question, 10, currentY);
                currentY += 10; // 질문 높이만큼 Y 좌표 이동

                // 7. 선택지 추가
                const choices = [
                    item.choice1Html,
                    item.choice2Html,
                    item.choice3Html,
                    item.choice4Html,
                    item.choice5Html,
                ];

                choices.forEach((choice, choiceIndex) => {
                    const choiceText = choice.replace(/<\/?[^>]+(>|$)/g, ""); // HTML 태그 제거
                    doc.text(`선택지 ${choiceIndex + 1}: ${choiceText}`, 10, currentY);
                    currentY += 10; // 선택지 높이만큼 Y 좌표 이동
                });

                // 각 문제 사이에 간격 추가
                currentY += 10;
            });

            // 8. PDF 다운로드
            doc.save('exam.pdf');
        } catch (error) {
            console.error("API 요청 중 오류 발생:", error);
        }
    };


    return (
        <div>
            <Button onClick={handleDownload}>시험지 다운로드</Button>
        </div>
    );
};

export default Step4Page3;
