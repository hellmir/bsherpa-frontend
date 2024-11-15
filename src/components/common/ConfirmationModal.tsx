import React from "react";
import "../../assets/css/confirmationModal.css";

interface Detail {
    level: string;
    count: number;
}

interface ConfirmationModalProps {
    title: string;
    message: string;
    details: Detail[];
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                 title,
                                                                 message,
                                                                 details,
                                                                 onCancel,
                                                                 onConfirm,
                                                             }) => {
    const total = details.reduce((sum, detail) => sum + detail.count, 0);

    return (
        <div className="confirm-modal">
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="difficulty-table">
                    {details.map((detail) => (
                        <div key={detail.level} className="difficulty-item">
                            <span className={`difficulty-${detail.level}`}>
                                {detail.level}
                            </span>
                            <div className="difficulty-value">{detail.count}</div>
                        </div>
                    ))}
                    <div className="difficulty-item">
                        <span>합계</span>
                        <div className="difficulty-value">{total}</div>
                    </div>
                </div>
                <p>해당 문제 구성으로 재검색하시겠습니까?</p>
                <div className="modal-buttons">
                    <button className="cancel-button" onClick={onCancel}>
                        취소
                    </button>
                    <button className="confirm-button" onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
