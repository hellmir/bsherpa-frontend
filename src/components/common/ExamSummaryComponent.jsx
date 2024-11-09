import {Draggable, Droppable} from "react-beautiful-dnd";
import React from "react";
import QuesionTypeCountComponent from "./QuesionTypeCountComponent.jsx";

export default function ExamSummaryComponent({itemList, groupedItems}) {
    const sortedGroupedItems = Object.keys(groupedItems)
        .map((passageId) => ({
            passageId,
            items: groupedItems[passageId],
            firstIndex: itemList.findIndex((i) => i.itemId === groupedItems[passageId][0].itemId)
        }))
        .sort((a, b) => a.firstIndex - b.firstIndex);

    const handleScrollToQuestion = (itemId) => {
        const element = document.getElementById(`question-${itemId}`);
        if (element) {
            element.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
        <div className="contents on">
            <div className="table half-type no-passage" style={{overflowY: "auto", maxHeight: "100%"}}>
                <div className="fix-head" style={{position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 1}}>
                    <span className="move-header">이동</span>
                    <span className="number-header">번호</span>
                    <span className="question-form-header">문제 형태</span>
                    <span className="question-type-header">문제 유형</span>
                    <span className="difficulty-header">난이도</span>
                </div>
                <div className="table-body" style={{overflowY: "auto", maxHeight: "32.23em"}}>
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
                                        isDragDisabled={passageId === "noPassage"}
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
                                                    >
                                                    </div>
                                                )}

                                                <Droppable droppableId={`${passageId}`} type="ITEM">
                                                    {(innerProvided) => (
                                                        <div
                                                            ref={innerProvided.innerRef}
                                                            {...innerProvided.droppableProps}
                                                            className="col-group"
                                                        >
                                                            {items.map((item) => {
                                                                const overallIndex = itemList.findIndex(i => i.itemId === item.itemId);
                                                                return (
                                                                    <Draggable
                                                                        key={`item-${item.itemId}`}
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
                                                                                    <span
                                                                                        className="question-type-data">
                                                                                    {item.questionFormCode <= 50 ? "객관식" : "주관식"}
                                                                                </span>
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
            </div>
            <QuesionTypeCountComponent itemList={itemList}/>
        </div>
    );
}
