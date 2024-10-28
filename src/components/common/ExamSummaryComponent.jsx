import {Draggable, Droppable} from "react-beautiful-dnd";
import React from "react";
import QuesionTypeCountComponent from "./QuesionTypeCountComponent.jsx";

export default function ExamSummaryComponent({itemList, sortedGroupedItems, truncateText}) {
    return (
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
                                                                                <span
                                                                                    className="question-type-data">{item.questionFormCode <= 50 ? "객관식" : "주관식"}</span>
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
            <QuesionTypeCountComponent itemList={itemList}/>
        </div>
    );
}