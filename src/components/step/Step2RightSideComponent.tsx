import React, {useState} from "react";
// @ts-ignore
import {DragDropContext, DropResult} from "react-beautiful-dnd";
import CommonResource from "../../util/CommonResource";
import ExamSummaryComponent from "../common/ExamSummaryComponent";
import Step2SimilarItemsComponent from "./Step2SimilarItemsComponent";
import Step2DeletedItemsComponent from "./Step2DeletedItemsComponent";
import {Item} from "../../type/Item";

interface Step2RightSideComponentProps {
    itemList: Item[];
    onDragEnd: (result: DropResult) => void;
    onShowSimilar: (itemId: number, index: number) => void;
    questionIndex: number;
    similarItems: Item[];
    deletedItems: Item[];
    onAddItem: (item: Item) => void;
}

interface GroupedItem {
    passageId: string | number;
    passageUrl?: string | null;
    items: Item[];
}

export default function Step2RightSideComponent({
                                                    itemList,
                                                    onDragEnd,
                                                    onShowSimilar,
                                                    questionIndex,
                                                    similarItems,
                                                    deletedItems,
                                                    onAddItem,
                                                }: Step2RightSideComponentProps) {
    const groupedDeletedItems: GroupedItem[] = deletedItems.reduce((acc: GroupedItem[], item: Item) => {
        const group = acc.find(g => g.passageId === item.passageId);
        if (group) {
            group.items.push(item);
        } else {
            acc.push({passageId: item.passageId, passageUrl: item.passageUrl, items: [item]});
        }
        return acc;
    }, []);

    const [activeTab, setActiveTab] = useState<string>("summary");
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    const groupByPassage = (items: Item[]): Record<string | number, Item[]> => {
        return items.reduce((acc, item) => {
            const passageId = item.passageId || "noPassage";
            if (!acc[passageId]) {
                acc[passageId] = [];
            }
            acc[passageId].push(item);
            return acc;
        }, {} as Record<string | number, Item[]>);
    };

    const handleTabClick = (tab: string, itemId: number | null = null, index: number | null = null) => {
        setActiveTab(tab);
        if (tab === "similar" && itemId && index !== null) {
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
                        <li className={`ui-tab-btn ${activeTab === "deleted" ? "active" : ""}`}>
                            <a href="#" onClick={() => handleTabClick("deleted")}>삭제 문항</a>
                        </li>
                    </ul>

                    {activeTab === "summary" && (
                        <ExamSummaryComponent itemList={itemList} groupedItems={groupByPassage(itemList)}/>
                    )}
                    {activeTab === "similar" && (
                        <Step2SimilarItemsComponent
                            items={similarItems}
                            questionNumber={questionIndex}
                            onAddItem={onAddItem}
                        />
                    )}
                    {activeTab === "deleted" && (
                        <Step2DeletedItemsComponent
                            deletedItems={groupedDeletedItems}
                            onRestoreItem={onAddItem}
                        />
                    )}
                </div>
            </DragDropContext>
        </>
    );
}
