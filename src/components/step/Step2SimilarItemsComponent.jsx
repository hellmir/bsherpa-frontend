import React, {useState} from "react";
import {getDifficultyColor} from "../../util/difficultyColorProvider.js";

export default function Step2SimilarItemsComponent({items, onBack, questionNumber}) {
    const [selectedDifficulty, setSelectedDifficulty] = useState("전체");

    const hasPassage = items.some((item) => item.passageId && item.passageUrl);

    const handleDifficultyChange = (event) => {
        setSelectedDifficulty(event.target.value);
    };

    const filteredItems = selectedDifficulty === "전체"
        ? items
        : items.filter(item => item.difficultyName === selectedDifficulty);

    return (
        <div className="similar-items-container" style={{
            height: "100%",
            overflowY: "auto",
            padding: "20px",
            boxSizing: "border-box"
        }}>
            {filteredItems.length > 0 && (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}>
                    <h2>{questionNumber}번 유사 문제</h2>
                    <div>
                        <label htmlFor="difficulty-select" style={{marginRight: "10px"}}>난이도</label>
                        <select
                            id="difficulty-select"
                            value={selectedDifficulty}
                            onChange={handleDifficultyChange}
                            style={{
                                padding: "5px 10px",
                                fontSize: "14px",
                                border: "1px solid #ddd",
                                borderRadius: "4px"
                            }}
                        >
                            <option value="전체">난이도 전체</option>
                            <option value="최상">최상</option>
                            <option value="상">상</option>
                            <option value="중">중</option>
                            <option value="하">하</option>
                            <option value="최하">최하</option>
                        </select>
                    </div>
                </div>
            )}

            {hasPassage && filteredItems.length > 0 && (
                <div className="passage-group-wrapper" style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    maxWidth: "100%"
                }}>
                    <div className="passage-group-header" style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        borderBottom: "1px solid #ddd",
                        paddingBottom: "5px",
                        marginBottom: "10px"
                    }}>
                        <span style={{fontSize: "18px", fontWeight: "bold"}}>지문</span>
                    </div>
                    <div className="passage" style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        maxHeight: "300px",
                        overflowY: "auto"
                    }}>
                        <img src={items[0].passageUrl} alt="지문 이미지" style={{width: "100%", display: "block"}}/>
                    </div>
                </div>
            )}

            {filteredItems.length > 0 ? (
                <div className="view-que-list scroll-inner" style={{overflowY: "auto", maxHeight: "60vh"}}>
                    {filteredItems.map((item, index) => (
                        <div key={`similar-item-${item.itemId}-${index}`} className="view-que-box"
                             style={{marginBottom: "15px"}}>
                            <div className="que-top">
                                <div className="title">
                                    <span className="num">{index + 1}</span>
                                    <div className="que-badge-group">
                                        <span className={`que-badge ${getDifficultyColor(item.difficultyName)}`}>
                                            {item.difficultyName}
                                        </span>
                                        <span className="que-badge gray">
                                            {item.questionFormCode <= 50 ? "객관식" : "주관식"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="view-que">
                                <div className="que-content">
                                    {item.questionUrl ? (
                                        <img src={item.questionUrl} alt="문제 이미지" style={{width: "100%"}}/>
                                    ) : (
                                        <p className="txt">문제 텍스트 없음</p>
                                    )}
                                </div>
                                <div className="que-bottom">
                                    {item.answerUrl && (
                                        <div className="data-area">
                                            <div className="que-info">
                                                <p className="answer">
                                                    <span className="label type01"
                                                          style={{textAlign: "left", paddingLeft: "20px"}}>
                                                        정답
                                                    </span>
                                                </p>
                                                <div className="data-answer-area">
                                                    <img src={item.answerUrl} alt="정답 이미지" style={{width: "100%"}}/>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {item.explainUrl && (
                                        <div className="data-area">
                                            <div className="que-info">
                                                <p className="answer">
                                                    <span className="label"
                                                          style={{textAlign: "left", paddingLeft: "20px"}}>해설</span>
                                                </p>
                                                <div className="data-answer-area">
                                                    <img src={item.explainUrl} alt="해설 이미지" style={{width: "100%"}}/>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh",
                    fontSize: "18px",
                    color: "#555",
                    textAlign: "center",
                }}>
                    좌측 문제 목록에서&nbsp;&nbsp;
                    <div className="btn-similar-que btn-default"><i className="similar"></i> 유사문제</div>
                    &nbsp;&nbsp;버튼을 클릭해 주세요.
                </div>
            )}
        </div>
    );
}
