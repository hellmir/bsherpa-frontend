import React from "react";

export default function QuesionTypeCountComponent({itemList}) {
    return (
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
    );
}
