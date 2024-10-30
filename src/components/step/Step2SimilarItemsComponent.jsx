import React, {useState} from "react";
import {getDifficultyColor} from "../../util/difficultyColorProvider.js";
import ErrorReportModal from "../common/ErrorReportModalComponent.jsx";

export default function Step2SimilarItemsComponent({items, onBack, questionNumber, onAddItem}) {
    const [selectedDifficulty, setSelectedDifficulty] = useState("전체");
    const [isErrorReportOpen, setIsErrorReportOpen] = useState(false);

    const hasPassage = items.some((item) => item.passageId && item.passageUrl);

    const handleDifficultyChange = (event) => {
        setSelectedDifficulty(event.target.value);
    };

    const filteredItems = selectedDifficulty === "전체"
        ? items
        : items.filter(item => item.difficultyName === selectedDifficulty);

    const hasFilteredItems = filteredItems.length > 0;

    const questionRange = hasFilteredItems
        ? `${items.findIndex(i => i === filteredItems[0]) + 1} ~ ${items.findIndex(i => i === filteredItems[filteredItems.length - 1]) + 1}`
        : null;

    const groupedItemsByPassage = filteredItems.reduce((groups, item) => {
        const passageId = item.passageId || "noPassage";
        if (!groups[passageId]) {
            groups[passageId] = {
                passageUrl: item.passageUrl || null,
                items: [],
            };
        }
        groups[passageId].items.push(item);
        return groups;
    }, {});

    const handleOpenErrorReport = () => setIsErrorReportOpen(true);
    const handleCloseErrorReport = () => setIsErrorReportOpen(false);

    return (
        <>
            <ErrorReportModal isOpen={isErrorReportOpen} onClose={handleCloseErrorReport}/>
            <div className="similar-items-container" style={{
                height: "100%",
                overflowY: "auto",
                padding: "20px",
                boxSizing: "border-box"
            }}>
                {items.length > 0 && (
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px"
                    }}>
                        <h2 style={{fontSize: "21px", fontWeight: "bold"}}>{questionNumber}번 유사 문제</h2>
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

                {items.length === 0 ? (
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
                        <div className="btn-similar-que btn-default"><i className="similar"></i> 유사 문제</div>
                        &nbsp;&nbsp;버튼을 클릭해 주세요.
                    </div>
                ) : hasFilteredItems ? (
                    <div className="view-que-list scroll-inner" style={{overflowY: "auto", maxHeight: "60vh"}}>
                        {Object.entries(groupedItemsByPassage).map(([passageId, group], groupIndex) => (
                            <div key={`passage-${passageId}-${groupIndex}`} style={{marginBottom: "20px"}}>
                                {group.passageUrl && (
                                    <div className="passage" style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        marginBottom: "10px"
                                    }}>
                                        <img src={group.passageUrl} alt="지문 이미지" style={{width: "100%"}}/>
                                    </div>
                                )}
                                {group.items.map((item) => (
                                    <div key={`similar-item-${item.itemId}`} className="view-que-box"
                                         style={{marginBottom: "15px"}}>
                                        <div className="que-top">
                                            <div className="title">
                                                <span className="num">{filteredItems.indexOf(item) + 1}</span>
                                                <div className="que-badge-group">
                                                <span
                                                    className={`que-badge ${getDifficultyColor(item.difficultyName)}`}>
                                                    {item.difficultyName}
                                                </span>
                                                    <span className="que-badge gray">
                                                    {item.questionFormCode <= 50 ? "객관식" : "주관식"}
                                                </span>
                                                </div>
                                            </div>
                                            <div className="btn-wrap">
                                                <button type="button" className="btn-error pop-btn"
                                                        onClick={handleOpenErrorReport}></button>

                                                <button type="button"
                                                        className="btn-delete"
                                                        onClick={() => handleDeleteItem(item.itemId)}
                                                >
                                                </button>
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
                                        </div>
                                        <div className="que-bottom">
                                            <div className="btn-wrap">
                                                <button
                                                    type="button"
                                                    className="btn-default"
                                                    style={{fontSize: "16px", padding: "8px 12px"}}
                                                    onClick={() => onAddItem(item)}
                                                >
                                                    <i className="add-type02"></i>추가
                                                </button>
                                            </div>
                                        </div>
                                        <div className="que-info-last">
                                            <p className="chapter">
                                                {item.largeChapterName} &gt; {item.mediumChapterName} &gt; {item.smallChapterName} &gt; {item.topicChapterName}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "60vh",
                        fontSize: "18px",
                        color: "#555",
                        textAlign: "center",
                    }}>
                        <p>해당 난이도의 유사 문제는 존재하지 않습니다.</p>
                    </div>
                )}
            </div>
        </>
    );
}
