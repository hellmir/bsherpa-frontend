import React, {useState} from "react";
import '../../assets/css/errorReportModal.css';
import {postRegisterErrorReport} from "../../api/step2Api.js";
import useCustomLogin from "../../hooks/useCustomLogin.jsx";

export default function ErrorReportModal({itemId, isOpen, onClose}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorType, setErrorType] = useState("문제오류");
    const [errorContent, setErrorContent] = useState("");
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const [submissionFailure, setSubmissionFailure] = useState(false);
    const [submissionFailureMessage, setSubmissionFailureMessage] = useState(null);
    const {loginState, doLogout, moveToPath, isLogin, moveToLoginReturn}
        = useCustomLogin()

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        const userEmail = loginState.email ? loginState.email : "abc@abc.com" // 천재교육 네트워크 환경을 고려해 카카오 로그인 실패 시 대체 이메일 주소 사용
        formData.append("userEmail", userEmail);
        formData.append("itemId", itemId)
        formData.append("type", errorType);
        if (selectedFile) {
            formData.append("image", selectedFile);
        }
        formData.append("content", errorContent);

        console.log(userEmail + "asdlfkj;s");
        console.log(itemId + "asdlfkj;s");

        try {
            await postRegisterErrorReport(formData);
            console.log("오류 신고 제출 성공");
            setSubmissionSuccess(true);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setSubmissionFailure(true);
                setSubmissionFailureMessage("이미 신고가 접수된 문항입니다.");
                console.error("이미 신고가 접수된 문항입니다:", error);
            } else {
                setSubmissionFailure(true);
                setSubmissionFailureMessage("오류 신고 제출에 실패했습니다.");
                console.error("오류 신고 제출 실패:", error);
            }
        }
    };

    const handleClose = () => {
        setSubmissionSuccess(false);
        setSelectedFile(null);
        setErrorContent("");
        setErrorType("문제오류");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="error-report-modal">
            <div className="modal-header">
                <h2>문항 오류 신고</h2>
                <button onClick={handleClose} className="close-btn">×</button>
            </div>
            {submissionSuccess
                ? (
                    <div className="modal-content">
                        <p>문항 오류 신고가 접수되었습니다.</p>
                        <button
                            onClick={handleClose}
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
                            닫기
                        </button>
                    </div>
                ) : (submissionFailure
                    ? (
                        <div className="modal-content">
                            <p>{submissionFailureMessage}</p>
                            <button
                                onClick={handleClose}
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
                                닫기
                            </button>
                        </div>
                    ) : (
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
                                    <option>풀이오류</option>
                                    <option>이미지오류</option>
                                    <option>유형오류</option>
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
                    ))}
        </div>
    );
}
