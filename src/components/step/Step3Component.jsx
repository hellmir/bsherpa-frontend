import React, {useState} from "react";
// import "../../assets/css/common.css"
// import "../../assets/css/font.css"
// import "../../assets/css/reset.css"
import {Link} from "react-router-dom";
export default function Step3Component() {
    // 필요한 것 props 받아와서 처리 (return 부분에서 map으로 보여줌)
    // step1 로 돌아갈 때 링크에 subjectId 같이 보내줄 것
    // step2 로 돌아갈 때 받았던 props 그대로 반환해줄 것
    
    const [examName, setExamName] = useState("");
    // 예외처리용 regExp
    // const regExp= /[\/?:|*+<>\;\"#%\\]/gi;

    

    function handleSave() {
        alert("저장 or 실패");
    }

    return (
        <div id="wrap" className="full-pop-que">
            <div className="full-pop-wrap">
                <div className="pop-header">
                    <ul className="title">
                        <li>STEP 1 단원선택</li>
                        <li>STEP 2 문항 편집</li>
                        <li className="active">STEP 3 시험지 저장</li>
                    </ul>
                    <button type="button" className="del-btn"></button>
                </div>
                <div className="pop-content">
                    <div className="view-box">
                        <div className="view-top">
                            <div className="paper-info">
                                <span>수학 1</span> 이준열(2015)
                            </div>
                            <div className="btn-wrap">
                                <Link to="/exam/step1/" className="btn-default">처음으로</Link>
                            </div>
                        </div>
                        <div className="view-bottom type02 scroll-inner">
                            <div className="top-form">
                                <div className="left-wrap">
                                    <span>시험지명</span>
                                    <div className="search-wrap">
                                        <div className="search-box">
                                            <input
                                                type="text"
                                                placeholder="시험지명을 입력해주세요. (최대 20자)"
                                                className="search"
                                                value={examName}
                                                onChange={(e) => setExamName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-list-type01">
                                <div className="table">
                                    <div className="fix-head">
                                        <span>번호</span>
                                        <span>문제 유형</span>
                                        <span>문제 형태</span>
                                        <span>난이도</span>
                                    </div>
                                    <div className="tbody">
                                        <div className="scroll-inner">
                                            {/* length = 문제 갯수만큼 */}
                                            {Array.from({ length: 10 }).map((index) => (
                                                <div className="col" key={index}>
                                                    <span>{index + 1}</span>
                                                    <span className="tit">1. 새로운 시작 &gt; (1) 시의 아름다움</span>
                                                    <span>주관식</span>
                                                    <span>하</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="step-btn-wrap">
                    <Link to = "/exam/step2/" className="btn-step">STEP 2 문항 편집</Link>
                    <button type="button" className="btn-step next done" onClick={handleSave}>시험지 저장하기</button>
                </div>
            </div>
            <div className="dim"></div>
        </div>
    )
}
