import Button from "@mui/material/Button";
import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {API_SERVER_HOST} from "../../api/config.js";

function StepPdfPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const pdfRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_SERVER_HOST}/questions/external/exam?examId=1416`,{
                    headers: {
                        'Content-Type': 'application/json',
                        // 필요하다면 다른 헤더 추가
                    }}
                );

                setData(response.data)
            } catch (err) {
                setError(err.message);
            }
        }
        fetchData();
    }, []);

    const generatePDF = () => {
        const element = pdfRef.current;
        const opt = {
            margin: 1,
            filename: '',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        }
        // eslint-disable-next-line no-undef
        html2pdf()
            .from(element)
            .set(opt)
            .save();
    }


    return (
        <div>
            <h1>시험지 생성기</h1>
            {error && <p>오류: {error}</p>}
            {data && (
                <div>
                    <div ref={pdfRef} style={{padding: '20px'}}>
                        {/* 데이터를 HTML로 렌더링 */}
                        {data.explainHtml && (
                            <div dangerouslySetInnerHTML={{__html: data.explainHtml}}/>
                        )}
                    </div>
                    <Button onClick={generatePDF}>PDF 저장하기</Button>
                </div>
            )}
        </div>
    )
}

export default StepPdfPage;