import React from "react";
import {Item} from "../../type/Item";

interface QuestionTypeCountComponentProps {
    itemList: Item[];
}

const QuestionTypeCountComponent: React.FC<QuestionTypeCountComponentProps> = ({itemList}) => {
    const objectiveCount = itemList.filter(item => item.questionFormCode <= 50).length;
    const subjectiveCount = itemList.filter(item => item.questionFormCode > 50).length;

    return (
        <div className="bottom-box">
            <div className="que-badge-group">
                <div className="que-badge-wrap">
                    <span className="que-badge gray">객관식</span>
                    <span className="num">{objectiveCount}</span>
                </div>
                <div className="que-badge-wrap">
                    <span className="que-badge gray">주관식</span>
                    <span className="num">{subjectiveCount}</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionTypeCountComponent;
