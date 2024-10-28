import React from "react";
import {DragDropContext} from "react-beautiful-dnd";
import CommonResource from "../../util/CommonResource.jsx";
import ExamSummaryComponent from "../common/ExamSummaryComponent.jsx";

export default function Step2RightSideComponent({itemList, onDragEnd}) {
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
                    <ExamSummaryComponent
                        itemList={itemList}
                        groupedItems={groupedItems}
                    />
                </div>
            </DragDropContext>
        </>
    );
}
