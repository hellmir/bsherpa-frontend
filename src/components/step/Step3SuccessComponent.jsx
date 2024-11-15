import CommonResource from "../../util/CommonResource.tsx";
import useCustomMove from "../../hooks/useCustomMove.jsx";

export default function Step3SuccessComponent(){
    const {moveToPath}= useCustomMove();
    const handleReset = () => {
        console.log('처음으로 버튼 클릭');
        moveToPath('/');
    };

    const handleGoToStorage = () => {
        console.log('시험지 보관함으로 이동');
        window.location.href = '/exam/storage'
        //moveToPath('../storage');
    };

    return (
        <>
            <CommonResource />
            <div className="pop-content">
                <div className="view-box save-complete">
                    <div className="btn-wrap">
                        <button className="btn-default" onClick={handleReset}>처음으로</button>
                    </div>

                    <div className="save-wrap">

                        <img src="/save.png" width="10%" height="auto" alt="저장완료 이미지" />
                        <span className="txt">
                            시험지가 저장되었습니다.
                            <span>저장된 시험지는 시험지 보관함 메뉴에서 확인 가능합니다. </span>
                        </span>
                        <div className="btn-wrap">
                            <button className="btn-icon" onClick={handleGoToStorage}>시험지 보관함으로 이동</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}