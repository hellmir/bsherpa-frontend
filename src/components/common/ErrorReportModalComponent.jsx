import React, {useState} from "react";
import '../../assets/css/errorReportModal.css';
import {postRegisterErrorReport} from "../../api/step2Api.js";

export default function ErrorReportModal({isOpen, onClose}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorType, setErrorType] = useState("문제오류");
    const [errorContent, setErrorContent] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("type", errorType);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }
        formData.append("content", errorContent);
        formData.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

        try {
            await postRegisterErrorReport(formData);
            console.log("오류 신고 제출 성공");
            onClose();
        } catch (error) {
            console.error("오류 신고 제출 실패:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="error-report-modal">
            <div className="modal-header">
                <h2>문항 오류 신고</h2>
                <button onClick={onClose} className="close-btn">×</button>
            </div>
            <div className="modal-content">
                <div>
                    <label htmlFor="errorType">오류유형</label>
                    <select
                        id="errorType"
                        value={errorType}
                        onChange={(e) => setErrorType(e.target.value)}
                        style={{width: "100%", padding: "8px", borderRadius: "4px"}}
                    >
                        <option>문제오류</option>
                        <option>정답오류</option>
                        <option>기타</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="fileUpload">첨부파일</label>
                    <input
                        type="file"
                        id="fileUpload"
                        onChange={handleFileChange}
                        style={{width: "100%", padding: "8px", borderRadius: "4px"}}
                    />
                </div>
                <div>
                    <label htmlFor="errorContent">오류 내용</label>
                    <textarea
                        id="errorContent"
                        placeholder="오류 내용을 간단히 적어주세요. (최대 200자)"
                        maxLength="200"
                        value={errorContent}
                        onChange={(e) => setErrorContent(e.target.value)}
                        style={{width: "100%", padding: "8px", borderRadius: "4px", height: "80px"}}
                    ></textarea>
                </div>
                <button
                    onClick={handleSubmit}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "4px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        fontWeight: "bold",
                        marginTop: "10px",
                    }}
                >
                    신고하기
                </button>
            </div>
        </div>
    );
}
