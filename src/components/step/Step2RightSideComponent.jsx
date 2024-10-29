import React, {useState} from "react";
import {DragDropContext} from "react-beautiful-dnd";
import CommonResource from "../../util/CommonResource.jsx";
import ExamSummaryComponent from "../common/ExamSummaryComponent.jsx";
import Step2SimilarItemsComponent from "./Step2SimilarItemsComponent.jsx";

export default function Step2RightSideComponent({itemList, onDragEnd, onShowSimilar, questionIndex, similarItems}) {
    const [activeTab, setActiveTab] = useState("summary");
    const [selectedItemId, setSelectedItemId] = useState(null);

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

    const handleTabClick = (tab, itemId = null, index = null) => {
        setActiveTab(tab);
        if (tab === "similar" && itemId && index) {
            setSelectedItemId(itemId);
            onShowSimilar(itemId, index);
        }
    };

    return (
        <>
            <CommonResource/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="tab-wrap">
                    <ul className="tab-menu-type01">
                        <li className={`ui-tab-btn ${activeTab === "summary" ? "active" : ""}`}>
                            <a href="#" onClick={() => handleTabClick("summary")}>문제지 요약</a>
                        </li>
                        <li className={`ui-tab-btn ${activeTab === "similar" ? "active" : ""}`}>
                            <a href="#" onClick={() => handleTabClick("similar")}>유사 문제</a>
                        </li>
                        <li className="ui-tab-btn">
                            <a href="#">삭제 문항</a>
                        </li>
                    </ul>

                    {activeTab === "summary" ? (
                        <ExamSummaryComponent itemList={itemList} groupedItems={groupByPassage(itemList)}/>
                    ) : (
                        <Step2SimilarItemsComponent
                            items={similarItems}
                            onBack={() => setActiveTab("summary")}
                            questionNumber={questionIndex}
                        />
                    )}
                </div>
            </DragDropContext>
        </>
    );
}
