import React from "react";
import {getDifficultyColor} from "../../util/difficultyColorProvider.js";

export default function DeletedItemsComponent({deletedItems, onBack, onRestoreItem}) {
    return (
        <div className="deleted-items-container" style={{
            height: "100%",
            overflowY: "auto",
            padding: "20px",
            boxSizing: "border-box"
        }}>
            {deletedItems.length > 0 ? (
                <div className="view-que-list scroll-inner" style={{overflowY: "auto", maxHeight: "60vh"}}>
                    {deletedItems.map((item, index) => (
                        <div key={`deleted-item-${item.itemId}-${index}`} className="view-que-box"
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
                                <div className="btn-wrap">
                                    <button type="button"
                                            className="btn-error pop-btn"
                                            data-pop="error-report-pop"></button>
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
                                        onClick={() => onRestoreItem(item)}
                                    >
                                        <i className="add-type02"></i>추가
                                    </button>
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
                    삭제한 문항이 없습니다.
                </div>
            )}
        </div>
    );
}
