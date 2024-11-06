import React, { useState, useEffect } from 'react';

const DifficultyDisplay = ({ isStudent = false, countsData, handleDifficultyCounts, handleIsConfirm, handleCloseDifficultyPopup, range }) => {
  const [selectedSteps, setSelectedSteps] = useState(['step2', 'step3', 'step4']);
  const [showRangePopup, setShowRangePopup] = useState(false);
  const [showAutoChangePopup, setShowAutoChangePopup] = useState(false);
  const [counts, setCounts] = useState({
    step1: 0,
    step2: 10,
    step3: 10,
    step4: 10,
    step5: 0
  });
  
  const [previousCounts, setPreviousCounts] = useState(() => ({
    ...counts
  }));

  const totalSum = parseInt(Object.values(counts).reduce((a, b) => a + b, 0));
  const numericRange = parseInt(range);
  const isSameValue = Number(totalSum) === Number(range);

  useEffect(() => {
    console.log('range;:::'+ range)
    if (countsData) {
      setCounts(countsData);
      setPreviousCounts(countsData);
    }
  }, [countsData]);

  const difficulties = [
    { step: 'step1', text: '최하', color: 'color01', disabled: true },
    { step: 'step2', text: '하', color: 'color02', disabled: false },
    { step: 'step3', text: '중', color: 'color03', disabled: false },
    { step: 'step4', text: '상', color: 'color04', disabled: false },
    { step: 'step5', text: '최상', color: 'color05', disabled: true }
  ];




  const redistributeCounts = (activeSteps, totalRange) => {
    const newCounts = {
      step1: 0,
      step2: 0,
      step3: 0,
      step4: 0,
      step5: 0
    };
    console.log('totalRange    : '+totalRange)
    if (activeSteps.length === 0) return newCounts;

    // 활성화된 스텝 수로 균등하게 나누기
    const equalShare = Math.floor(totalRange / activeSteps.length);
    activeSteps.forEach((step, index) => {
      if (index === activeSteps.length - 1) {
        // 마지막 스텝에 나머지 할당
        newCounts[step] = totalRange - (equalShare * (activeSteps.length - 1));
      } else {
        newCounts[step] = equalShare;
      }
    });

    return newCounts;
};



  const handleInputChange = (step, value) => {
    const newValue = parseInt(value) || 0;
    
    if (newValue < 0) return;

    const newCounts = {
      ...counts,
      [step]: newValue
    };

    setCounts(newCounts);
    setPreviousCounts(prev => ({
      ...prev,
      [step]: newValue
    }));
    handleDifficultyCounts(newCounts);
  };

  const handleStepClick = (step) => {
    const difficulty = difficulties.find(d => d.step === step);
    if (difficulty.disabled || isStudent) return;
    console.log('step   : '+ step)
    const isCurrentlySelected = selectedSteps.includes(step);
    let newSelectedSteps;
    let newCounts;
  
    if (isCurrentlySelected) {
      // 비활성화할 때
      newSelectedSteps = selectedSteps.filter(s => s !== step);
      setPreviousCounts(prev => ({
        ...prev,
        [step]: counts[step]
      }));
    } else {
      // 활성화할 때
      newSelectedSteps = [...selectedSteps, step].sort();
    }

    // 활성화된 스텝들 가져오기
    const activeSteps = newSelectedSteps.filter(s => !difficulties.find(d => d.step === s).disabled);
    console.log('range1: '+ range)
    newCounts = redistributeCounts(activeSteps, Number(range));
    console.log('range2: '+ range)
    setSelectedSteps(newSelectedSteps);
    setCounts(newCounts);
    handleDifficultyCounts(newCounts);
};

  const handleAutoChange = () => {
    handleDifficultyCounts(counts);
    setShowAutoChangePopup(false);
    setShowRangePopup(false);
    handleIsConfirm(true);
  };

  const handleReset = () => {
    const resetCounts = {
      step1: 0,
      step2: 0,
      step3: 0,
      step4: 0,
      step5: 0
    };
    setCounts(resetCounts);
    setPreviousCounts(resetCounts);
    handleDifficultyCounts(resetCounts);
  };





  return (
    <div className="difficulty-section">
    <div className="box">
      <div className="title-wrap"  style={{
        marginTop: '-50px'  // 텍스트 위 여백 줄임
      }}>
        <span className="tit-text" >난이도 구성</span>
      </div>
      <div className="step-wrap">
        {difficulties.map(({ step, text, color, disabled }) => (
          <button
            key={step}
            type="button"
            className={`btn-line type02 ${
              selectedSteps.includes(step) ? `${color} active` : ''
            } ${disabled || isStudent ? 'disabled' : ''}`}
            onClick={() => handleStepClick(step)}
            disabled={disabled || isStudent}
          >
            {text}
          </button>
        ))}
      </div>
    </div>

    <div className="box">
      <div className="title-wrap"  style={{
        marginTop: '-30px'  // 텍스트 위 여백 줄임
      }}>
        <span className="tit-text">
          난이도별 문제 수
          <button
            type="button"
            className="btn-icon2 pop-btn"
            onClick={() => setShowRangePopup(true)}
            disabled={isStudent}
          >
            <i className="setting"></i>
          </button>
        </span>
      </div>
      <div className="step-wrap">
        {difficulties
          .filter(({ step }) => selectedSteps.includes(step))
          .map(({ step, text, color }) => (
            <div
              key={step}
              className={`btn-line type02 ${color} active`}
            >
              {text}({counts[step]})
            </div>
          ))}
        </div>
      </div>

      {showRangePopup && !isStudent && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="pop-header">
              <span>난이도별 문제 수 설정</span>
              <button
                type="button"
                className="pop-close"
                onClick={() => setShowRangePopup(false)}
              ></button>
            </div>
            <div className="pop-content">
              <span className="txt">
                문제 수를 입력하여<br />
                난이도별 문제 수를 조정하세요.
              </span>
<h1 style={{ 
    fontWeight: "bold", 
    color:isSameValue ? "#000000" : "#FF0000" 
}}>
    위에서 선택한 문제 수는 {range} 입니다.
</h1>             

<div className="range-wrap">
  {difficulties.map(({ step, text, color, disabled }) => (
    <div key={step} className={`range ${color}`}>
      <span className={color}>{text}</span>
      <div className="input-group" style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          className="decrease-btn"
          onClick={() => {
            if (!disabled) {
              const newValue = Math.max(0, (counts[step] || 0) - 1);
              const newCounts = {
                ...counts,
                [step]: newValue
              };
              setCounts(newCounts);
              setPreviousCounts(prev => ({
                ...prev,
                [step]: newValue
              }));
              handleDifficultyCounts(newCounts);
            }
          }}
          disabled={disabled || counts[step] <= 0}
        >
          -
        </button>
        <input
          type="number"
          value={counts[step]}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || 0;
            const newCounts = {
              ...counts,
              [step]: newValue
            };
            setCounts(newCounts);
            setPreviousCounts(prev => ({
              ...prev,
              [step]: newValue
            }));
            handleDifficultyCounts(newCounts);
          }}
          disabled={disabled}
        />
        <button 
          className="increase-btn"
          onClick={() => {
            if (!disabled) {
              const newValue = (counts[step] || 0) + 1;
              const newCounts = {
                ...counts,
                [step]: newValue
              };
              setCounts(newCounts);
              setPreviousCounts(prev => ({
                ...prev,
                [step]: newValue
              }));
              handleDifficultyCounts(newCounts);
            }
          }}
          disabled={disabled}
        >
          +
        </button>
      </div>
    </div>
  ))}
  <div className="range total">
    <span>합계</span>
    <span className="num">{totalSum}</span>
  </div>
</div>
            </div>
            <div className="pop-footer">
              <button 
                onClick={() => {
                  setCounts({
                    step1: 0,
                    step2: 0,
                    step3: 0,
                    step4: 0,
                    step5: 0
                  });
                }}
                className="reset-btn"
              >
                초기화
              </button>
              <button
  className={`save-btn ${isSameValue ? '' : 'disabled'}`}
  onClick={() => {
    if (isSameValue) {
      handleAutoChange();
    }
  }}
  disabled={!isSameValue}
>
  저장
</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .difficulty-section {
          padding: 20px;
        }
        .box {
          margin-bottom: 20px;
        }
        .title-wrap {
          margin-bottom: 15px;
        }
        .tit-text {
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .step-wrap {
          display: flex;
          gap: 10px;
        }
        .btn-line {
          height: 36px;
          padding: 0 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          cursor: pointer;
        }
        .btn-line.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
        .btn-icon2 {
          margin-left: 8px;
          background: none;
          border: none;
          cursor: pointer;
        }
        .btn-icon2:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .setting:before {
          content: "⚙️";
          font-size: 16px;
        }
        
        .color01.active { background: #FF7170; color: white; border-color: #FF7170; }
        .color02.active { background: #FF9C52; color: white; border-color: #FF9C52; }
        .color03.active { background: #FFCD51; color: white; border-color: #FFCD51; }
        .color04.active { background: #9BE15D; color: white; border-color: #9BE15D; }
        .color05.active { background: #52C5FF; color: white; border-color: #52C5FF; }

        .range .color01 { color: #FF7170; }
        .range .color02 { color: #FF9C52; }
        .range .color03 { color: #FFCD51; }
        .range .color04 { color: #9BE15D; }
        .range .color05 { color: #52C5FF; }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
        }
        .pop-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
        }
        .pop-content {
          padding: 20px;
        }
        .pop-footer {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .txt {
          text-align: center;
          display: block;
          margin: 10px 0;
        }
        .range-wrap {
          margin: 20px 0;
        }
        .range {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
          padding: 8px;
        }
        .range input {
          width: 60px;
          padding: 4px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .range input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .input-group {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .decrease-btn,
        .increase-btn {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          background: #fff;
          border-radius: 4px;
          cursor: pointer;
        }

        .decrease-btn:hover,
        .increase-btn:hover {
          background: #f5f5f5;
        }

        .decrease-btn:disabled,
        .increase-btn:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.5;
        }

        input[type="number"] {
          width: 60px;
          text-align: center;
          padding: 4px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        .save-btn {
          padding: 8px 16px;
          border-radius: 4px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }

        .save-btn.disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .reset-btn {
          padding: 8px 16px;
          border-radius: 4px;
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          cursor: pointer;
        }

        .reset-btn:hover {
          background-color: #e9ecef;
        }
      `}</style>
    </div>
  );
};

export default DifficultyDisplay;