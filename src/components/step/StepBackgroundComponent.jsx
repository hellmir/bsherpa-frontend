import React from "react";
import {useLocation} from "react-router-dom";

export default function StepBackgroundComponent({children}){
    const location = useLocation();
    const step = location.pathname.split("/").pop();

    return (
        <div id="wrap" className="full-pop-que">
            <div className="full-pop-wrap">
                <div className="pop-header">
                    <ul className="title">
                        <li className={step === 'step1' ? 'active' : ''}>STEP 1 단원 선택</li>
                        <li className={step === 'step2' ? 'active' : ''}>STEP 2 문항 편집</li>
                        <li className={step === 'step3' ? 'active' : ''}>STEP 3 시험지 저장</li>
                    </ul>
                    <button type="button" className="del-btn"></button>
                </div>
                <div className="pop-content">
                    {children}
                </div>
            </div>
            <div className="dim"></div>
        </div>
    )
}