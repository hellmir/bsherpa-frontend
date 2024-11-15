import React from "react";
import {getDifficultyColor} from "../../util/difficultyColorProvider";

interface DifficultyCount {
    level: string;
    count: number;
}

interface DifficultyCountComponentProps {
    difficultyCounts: DifficultyCount[];
    totalQuestions: number;
}

const DifficultyCountComponent: React.FC<DifficultyCountComponentProps> = ({
                                                                               difficultyCounts,
                                                                               totalQuestions,
                                                                           }) => {
    return (
        <div className="bottom-box">
            <div className="que-badge-group type01">
                {difficultyCounts
                    .filter((difficulty) => difficulty.count > 0)
                    .map((difficulty) => (
                        <div key={difficulty.level} className="que-badge-wrap">
                            <span
                                className="que-badge"
                                style={{color: getDifficultyColor(difficulty.level)}}
                            >
                                {difficulty.level}
                            </span>
                            <span className="num">{difficulty.count}</span>
                        </div>
                    ))}
            </div>
            <p className="total-num">
                총 <span>{totalQuestions}</span>문제
            </p>
        </div>
    );
};

export default DifficultyCountComponent;
