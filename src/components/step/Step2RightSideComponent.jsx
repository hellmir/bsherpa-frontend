import React from "react";
import CommonResource from "../../util/CommonResource.jsx";

export default function Step2RightSideComponent({itemList}) {
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
        <>
            <CommonResource/>
            <div className="tab-wrap">
                <ul className="tab-menu-type01">
                    <li className="ui-tab-btn active">
                        <a href="javascript:;">문제지 요약</a>
                    </li>
                    <li className="ui-tab-btn">
                        <a href="javascript:;">유사 문제</a>
                    </li>
                    <li className="ui-tab-btn">
                        <a href="javascript:;">삭제 문항</a>
                    </li>
                </ul>
                <div className="contents on">
                    <div className="table half-type no-passage">
                        <div className="fix-head">
                            <span>이동</span>
                            <span className="number-column">번호</span>
                            <span>문제 형태</span>
                            <span>문제 유형</span>
                            <span>난이도</span>
                        </div>
                        <div className="tbody">
                            <div className="scroll-inner">
                                <div className="test ui-sortable" id="table-1">
                                    {itemList.map((item, index) => (
                                        <div className="col" key={item.itemId}>
                                            <a href="javascript:;">
                                                <span className="dragHandle ui-sortable-handle ico-move-type01"></span>
                                                <span className="number-column">{index + 1}</span>
                                                <span className="tit">
                                                    <div className="txt">
                                                        {truncateText(`${item.largeChapterName} > ${item.mediumChapterName} > ${item.smallChapterName} > ${item.topicChapterName}`, 30)}
                                                    </div>
                                                </span>
                                                <span>{item.questionFormCode <= 50 ? "객관식" : "주관식"}</span>
                                                <span>
                                                    <span
                                                        className={`que-badge ${item.difficultyName}`}>{item.difficultyName}</span>
                                                </span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-box">
                        <div className="que-badge-group">
                            <div className="que-badge-wrap">
                                <span className="que-badge gray">객관식</span>
                                <span
                                    className="num">{itemList.filter(item => item.questionFormCode <= 50).length}</span>
                            </div>
                            <div className="que-badge-wrap">
                                <span className="que-badge gray">주관식</span>
                                <span
                                    className="num">{itemList.filter(item => item.questionFormCode > 50).length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
