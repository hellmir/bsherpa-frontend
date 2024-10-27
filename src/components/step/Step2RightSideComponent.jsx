import React from "react";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import CommonResource from "../../util/CommonResource.jsx";

export default function Step2RightSideComponent({itemList, onDragEnd}) {
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    const handleScrollToQuestion = (itemId) => {
        const element = document.getElementById(`question-${itemId}`);
        if (element) {
            element.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    const groupByPassage = (items) => {
        return items.reduce((acc, item) => {
            const passageId = item.passageId || "noPassage";
            if (!acc[passageId]) {
                acc[passageId] = [];
            }
            acc[passageId].push(item);
            return acc;
        }, {});
    };

    const groupedItems = groupByPassage(itemList);

    const sortedGroupedItems = Object.keys(groupedItems)
        .map((passageId) => ({
            passageId,
            items: groupedItems[passageId],
            firstIndex: itemList.findIndex((i) => i.itemId === groupedItems[passageId][0].itemId)
        }))
        .sort((a, b) => a.firstIndex - b.firstIndex);

    return (
        <>
            <CommonResource/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="tab-wrap">
                    <ul className="tab-menu-type01">
                        <li className="ui-tab-btn active">
                            <a href="#">문제지 요약</a>
                        </li>
                        <li className="ui-tab-btn">
                            <a href="#">유사 문제</a>
                        </li>
                        <li className="ui-tab-btn">
                            <a href="#">삭제 문항</a>
                        </li>
                    </ul>
                    <div className="contents on">
                        <div className="table half-type no-passage" style={{overflowY: "auto", maxHeight: "400px"}}>
                            <div className="fix-head">
                                <span className="move-header">이동</span>
                                <span className="number-header">번호</span>
                                <span className="question-form-header">문제 형태</span>
                                <span className="question-type-header">문제 유형</span>
                                <span className="difficulty-header">난이도</span>
                            </div>
                            <Droppable droppableId="passageGroups" type="PASSAGE_GROUP">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="test ui-sortable"
                                        id="table-1"
                                    >
                                        {sortedGroupedItems.map(({passageId, items}, groupIndex) => (
                                            <Draggable
                                                key={`passage-${passageId}`}
                                                draggableId={`passage-${passageId}`}
                                                index={groupIndex}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        className={`depth-01 ${passageId !== "noPassage" ? "has-passage" : "no-passage"}`}
                                                    >
                                                        {passageId !== "noPassage" && (
                                                            <div
                                                                className="dragHandle ui-sortable-handle ico-move-type02"
                                                                {...provided.dragHandleProps}
                                                            ></div>
                                                        )}
                                                        <Droppable droppableId={passageId} type="ITEM">
                                                            {(innerProvided) => (
                                                                <div
                                                                    ref={innerProvided.innerRef}
                                                                    {...innerProvided.droppableProps}
                                                                    className="col-group"
                                                                >
                                                                    {items.map((item, index) => {
                                                                        const overallIndex = itemList.findIndex(i => i.itemId === item.itemId);
                                                                        return (
                                                                            <Draggable
                                                                                key={`it-${item.itemId}`}
                                                                                draggableId={`item-${item.itemId}`}
                                                                                index={overallIndex}
                                                                            >
                                                                                {(provided) => (
                                                                                    <div
                                                                                        className="col depth-02"
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        onClick={() => handleScrollToQuestion(item.itemId)}
                                                                                    >
                                                                                        <a href="#">
                                                                                            <span
                                                                                                className="dragHandle ui-sortable-handle ico-move-type01"></span>
                                                                                            <span>{overallIndex + 1}</span>
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
                                                                                )}
                                                                            </Draggable>
                                                                        );
                                                                    })}
                                                                    {innerProvided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
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
            </DragDropContext>
        </>
    );
}
