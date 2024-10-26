import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import axios from "axios";
import CommonResource from "../../util/CommonResource.jsx";
import {useSelector} from "react-redux";
export default function Step3Component() {
    const location = useLocation();
    const itemData = location.state?.data;
    console.log(`Step2로부터 전송된 문제 데이터 목록: ${JSON.stringify(itemData)}`);
    const [itemList, setItemList] = useState([]);

    // 시험명 추가용 로직

    const [examName, setExamName] = useState("");

    // 예외처리용 regExp (주석처리)
    // const regExp= /[\/?:|*+<>\;\"#%\\]/gi;

    function handleSave() {
        alert("저장 or 실패");
    }

    return (
        <div className="view-box">
            <CommonResource />
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
                                {itemList.map((item,index) => (
                                    <div className="col" key={item.itemNo}>
                                        <span>{item.itemNo}</span>
                                        <span className="tit">{item.largeChapterName}
                                            &gt;{item.mediumChapterName}
                                            &gt;{item.smallChapterName}
                                            &gt;{item.topicChapterName}
                                        </span>
                                        <span>{item.questionFormName}</span>
                                        <span>{item.difficultyName}</span>
                                        <span> </span>
                                    </div>
                                ))}
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
    )
}
