import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommonResource from "../../../util/CommonResource.jsx";
import useCustomMove from "../../../hooks/useCustomMove.jsx";





// 데이터 변환 함수
const transformData = (data) => {
  const hierarchy = {};
  
  data.forEach(item => {
    const {
      largeChapterName,
      mediumChapterName,
      smallChapterName,
      topicChapterName,
      largeChapterId,
      mediumChapterId,
      smallChapterId,
      topicChapterId
    } = item;

    // 대단원 레벨
    if (!hierarchy[largeChapterName]) {
      hierarchy[largeChapterName] = {
        id: largeChapterId,
        name: largeChapterName,
        children: {}
      };
    }

    // 중단원 레벨
    if (mediumChapterName) {
      if (!hierarchy[largeChapterName].children[mediumChapterName]) {
        hierarchy[largeChapterName].children[mediumChapterName] = {
          id: mediumChapterId,
          name: mediumChapterName,
          children: {}
        };
      }
    }

    // 소단원 레벨
    if (smallChapterName) {
      const mediumChapter = hierarchy[largeChapterName].children[mediumChapterName];
      if (mediumChapter && !mediumChapter.children[smallChapterName]) {
        mediumChapter.children[smallChapterName] = {
          id: smallChapterId,
          name: smallChapterName,
          children: {}
        };
      }
    }

    // 토픽 레벨
    if (topicChapterName && smallChapterName) {
      const smallChapter = hierarchy[largeChapterName].children[mediumChapterName]?.children[smallChapterName];
      if (smallChapter && !smallChapter.children[topicChapterName]) {
        smallChapter.children[topicChapterName] = {
          id: topicChapterId,
          name: topicChapterName
        };
      }
    }
  });

  return hierarchy;
};

// 모든 하위 노드의 ID를 가져오는 함수
const getAllChildNodeIds = (node) => {
  let ids = [`node-${node.id}`];
  if (node.children) {
    Object.values(node.children).forEach(child => {
      ids = [...ids, ...getAllChildNodeIds(child)];
    });
  }
  return ids;
};

// 모든 노드의 ID를 가져오는 함수
const getAllNodeIds = (data) => {
  let ids = [];
  Object.values(data).forEach(node => {
    ids = [...ids, ...getAllChildNodeIds(node)];
  });
  return ids;
};

// 상위 노드의 ID를 가져오는 함수
const getParentNodeId = (hierarchyData, targetId) => {
  let parentId = null;
  
  const searchParent = (data, target, currentParentId = null) => {
    Object.entries(data).forEach(([_, value]) => {
      if (value.children) {
        Object.values(value.children).forEach(child => {
          if (`node-${child.id}` === target) {
            parentId = `node-${value.id}`;
          }
          searchParent(value.children, target, `node-${value.id}`);
        });
      }
    });
  };
  
  searchParent(hierarchyData, targetId);
  return parentId;
};

// DynamicAccordionItem 컴포넌트
const DynamicAccordionItem = ({ 
  title, 
  id,
  isActive,
  isChecked,
  isIndeterminate,
  onToggle,
  onCheckChange,
  children,
  depth = 0 
}) => {
  const checkboxRef = React.useRef();

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className={`check-group title ${isActive ? 'on' : ''}`}>
      <div className="title-chk" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        paddingLeft: `${depth * 20}px`
      }}>
        <input
          ref={checkboxRef}
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={onCheckChange}
          className="que-allCheck depth01"
        />
        <label htmlFor={id} style={{ width: '100%' }}>
          <button
            type="button"
            className={`dep-btn ${isActive ? 'active' : ''}`}
            onClick={onToggle}
            style={{ textAlign: 'left', width: '100%' }}
          >
            {title}
          </button>
        </label>
      </div>
      {children && (
        <div className="depth02" style={{ 
          display: isActive ? 'block' : 'none',
          width: '100%'
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

// RenderHierarchy 컴포넌트
// 수정된 RenderHierarchy 컴포넌트
const RenderHierarchy = ({ 
  data, 
  activeNodes, 
  checkedNodes, 
  onToggle, 
  onCheckChange,
  depth = 0,
  hierarchyData 
}) => {
  return Object.entries(data).map(([key, value]) => {
    const hasChildren = Object.keys(value.children || {}).length > 0;
    const nodeId = `node-${value.id}`;
    
    // 현재 노드의 모든 자식 노드 ID 가져오기
    const childNodeIds = hasChildren ? getAllChildNodeIds(value) : [];
    
    // 자식 노드들의 체크 상태 확인
    const checkedChildCount = childNodeIds.filter(id => checkedNodes.includes(id)).length;
    const isIndeterminate = hasChildren && checkedChildCount > 0 && checkedChildCount < childNodeIds.length;
    const isChecked = hasChildren ? checkedChildCount === childNodeIds.length : checkedNodes.includes(nodeId);

    const updateParentNodes = (nodeId, newCheckedNodes) => {
      let currentNodeId = nodeId;
      while (true) {
        const parentId = getParentNodeId(hierarchyData, currentNodeId);
        if (!parentId) break;
        
        const parentNode = Object.values(hierarchyData).find(node => `node-${node.id}` === parentId);
        if (!parentNode) break;

        const parentChildIds = getAllChildNodeIds(parentNode).filter(id => id !== parentId);
        const anyChildChecked = parentChildIds.some(id => newCheckedNodes.includes(id));
        
        if (!anyChildChecked) {
          newCheckedNodes = newCheckedNodes.filter(id => id !== parentId);
        }
        
        currentNodeId = parentId;
      }
      return newCheckedNodes;
    };

    return (
      <DynamicAccordionItem
        key={nodeId}
        title={value.name}
        id={nodeId}
        isActive={activeNodes.includes(nodeId)}
        isChecked={isChecked}
        isIndeterminate={isIndeterminate}
        onToggle={() => onToggle(nodeId)}
        onCheckChange={(e) => {
          const newChecked = e.target.checked;
          let newCheckedNodes = [...checkedNodes];
          
          // 현재 노드 처리
          if (newChecked) {
            // 체크 시 현재 노드와 모든 자식 노드 체크
            newCheckedNodes.push(nodeId);
            if (hasChildren) {
              const childIds = getAllChildNodeIds(value);
              childIds.forEach(id => {
                if (!newCheckedNodes.includes(id)) {
                  newCheckedNodes.push(id);
                }
              });
            }
          } else {
            // 체크 해제 시 현재 노드와 모든 자식 노드 체크 해제
            newCheckedNodes = newCheckedNodes.filter(id => id !== nodeId);
            if (hasChildren) {
              const childIds = getAllChildNodeIds(value);
              newCheckedNodes = newCheckedNodes.filter(id => !childIds.includes(id));
            }
            
            // 부모 노드들 상태 업데이트
            newCheckedNodes = updateParentNodes(nodeId, newCheckedNodes);
          }
          
          onCheckChange(newCheckedNodes);
        }}
        depth={depth}
      >
        {hasChildren && (
          <RenderHierarchy
            data={value.children}
            activeNodes={activeNodes}
            checkedNodes={checkedNodes}
            onToggle={onToggle}
            onCheckChange={onCheckChange}
            depth={depth + 1}
            hierarchyData={hierarchyData}
          />
        )}
      </DynamicAccordionItem>
    );
  });
};


const Step1Component = () => {
  // 상태 관리
  const [hierarchyData, setHierarchyData] = useState({});
  const [activeNodes, setActiveNodes] = useState([]);
  const [checkedNodes, setCheckedNodes] = useState([]);
  const [range, setRange] = useState('30');
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState([]);
  const [selectedQuestiontype, setSelectedQuestiontype] = useState('');
  const [source, setSource] = useState('');

  // API 데이터 로드
  useEffect(() => {
    axios.post('https://bsherpa.duckdns.org/step1/chapters')
      .then((response) => {
        const transformed = transformData(response.data.chapterList);
        setHierarchyData(transformed);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  // 아코디언 토글 핸들러
  const handleToggle = (nodeId) => {
    setActiveNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  // 체크박스 변경 핸들러
  const handleCheckChange = (newCheckedNodes) => {
    setCheckedNodes(newCheckedNodes);
  };

  // 범위 버튼 클릭 핸들러
  const handleRangeButtonClick = (value) => {
    setRange(value);
  };

  // 범위 입력 변경 핸들러
  const handleRangeInputChange = (event) => {
    setRange(event.target.value);
  };

  // 단계 버튼 클릭 핸들러
  const handleStepButtonClick = (step) => {
    setSelectedSteps(prev => 
      prev.includes(step)
        ? prev.filter(item => item !== step)
        : [...prev, step]
    );
  };

  // 평가 영역 버튼 클릭 핸들러
  const handleEvaluationButtonClick = (evaluation) => {
    setSelectedEvaluation(prev =>
      prev.includes(evaluation)
        ? prev.filter(item => item !== evaluation)
        : [...prev, evaluation]
    );
  };

  // 문제 유형 클릭 핸들러
  const handleQuestionTypeClick = (questiontype) => {
    setSelectedQuestiontype(prev => prev === questiontype ? '' : questiontype);
  };

  // 출처 클릭 핸들러
  const handleSourceClick = (sourceType) => {
    setSource(prev => prev === sourceType ? '' : sourceType);
  };

  const {moveToPath} = useCustomMove()

  return (
    <div id="wrap" className="full-pop-que">
      <CommonResource />
      <div className="full-pop-wrap">
        {/* 팝업 헤더 */}
        <div className="pop-header">
          <ul className="title">
            <li className="active">STEP 1 단원선택</li>
            <li>STEP 2 문항 편집</li>
            <li>STEP 3 시험지 저장</li>
          </ul>
          <button type="button" className="del-btn"></button>
        </div>

        <div className="pop-content">
          <div className="view-box">
            <div className="view-top">
              <div className="paper-info">
                <span>국어 1-1</span>
                노미숙(2015)
              </div>
            </div>

            <div className="view-bottom">
              <div className="view-box-wrap">
                <div className="unit-box-wrap">
                  <div className="unit-box">
                    <div className="unit-cnt scroll-inner">
                      <div className="title-top">
                        <span>단원정보</span>
                        <input
                          type="checkbox"
                          id="allCheck"
                          onChange={(e) => {
                            const allNodeIds = getAllNodeIds(hierarchyData);
                            setCheckedNodes(e.target.checked ? allNodeIds : []);
                          }}
                          className="allCheck"
                        />
                        <label htmlFor="allCheck">전체선택</label>
                      </div>
                      <ul style={{ width: '100%' }}>
                        <li style={{ width: '100%' }}>
                          <RenderHierarchy
                            data={hierarchyData}
                            activeNodes={activeNodes}
                            checkedNodes={checkedNodes}
                            onToggle={handleToggle}
                            onCheckChange={handleCheckChange}
                            hierarchyData={hierarchyData}
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 옵션 선택 */}
                <div className="type-box-wrap">
                  <div className="type-box scroll-inner">
                    <div className="title-top">
                      <span>출제옵션</span>
                    </div>
                    
                    {/* 문제 수 */}
                    <div className="box">
                      <div className="title-wrap">
                        <span className="tit-text">
                          문제 수<em>최대 30문제</em>
                        </span>
                      </div>
                      <div className="count-area">
                        <div className="btn-wrap">
                          {['10', '15', '20', '25', '30'].map(value => (
                            <button
                              key={value}
                              type="button"
                              className={`btn-line ${range === value ? 'active' : ''}`}
                              onClick={() => handleRangeButtonClick(value)}
                            >
                              {value}
                            </button>
                          ))}
                        </div>
                        <div className="input-area">
                          <span className="num">
                            총 <input type="text" value={range} onChange={handleRangeInputChange} /> 문제
                          </span>
                          <div className="txt">*5의 배수로 입력해주세요.</div>
                        </div>
                      </div>
                    </div>

                    {/* 출처 */}
                    <div className="box">
                      <div className="title-wrap">
                        <span className="tit-text">출처</span>
                      </div>
                      <div className="btn-wrap multi">
                        <button
                          type="button"
                          className={`btn-line ${source === 'teacher' ? 'active' : ''}`}
                          onClick={() => handleSourceClick('teacher')}
                        >
                          교사용(교사용 DVD, 지도서, 신규 개발 등)
                        </button>
                        <button
                          type="button"
                          className={`btn-line ${source === 'student' ? 'active' : ''}`}
                          onClick={() => handleSourceClick('student')}
                        >
                          학생용(자습서, 평가문제집 등)
                        </button>
                      </div>
                    </div>

                    {/* 평가 영역 */}
                    <div className="box">
                      <div className="title-wrap">
                        <span className="tit-text">평가 영역</span>
                      </div>
                      <div className="btn-wrap multi">
                        {[
                          ['evolution1', '자료 해석'],
                          ['evolution2', '이해'],
                          ['evolution3', '적용']
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            className={`btn-line ${selectedEvaluation.includes(value) ? 'active' : ''}`}
                            onClick={() => handleEvaluationButtonClick(value)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <div className="btn-wrap multi">
                        {[
                          ['evolution4', '지식'],
                          ['evolution5', '결론도출']
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            className={`btn-line ${selectedEvaluation.includes(value) ? 'active' : ''}`}
                            onClick={() => handleEvaluationButtonClick(value)}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                        {/* 문제 형태 */}
    
                        <div className='box'>
                          <div className='title-wrap'>
                            <span className='tit-text'>문제 형태</span>
                          </div>
                          <div className='btn-wrap multi'>
                            <button
                              type='button'
                              className={`btn-line  ${
                                selectedQuestiontype === 'objective' ? 'active' : ''
                              }`}
                              data-step='objective'
                              onClick={() => handleQuestionTypeClick('objective')}
                            >
                              객관식
                            </button>
                            <button
                              type='button'
                              className={`btn-line  ${
                                selectedQuestiontype === 'subjective'
                                  ? 'active'
                                  : ''
                              }`}
                              data-step='subjective'
                              onClick={() => handleQuestionTypeClick('subjective')}
                            >
                              주관식
                            </button>
                          </div>
                        </div>
    
                        {/* 난이도 구성 */}
                        <div className='box'>
                          <div className='title-wrap'>
                            <span className='tit-text'>난이도 구성</span>
                          </div>
                          <div className='step-wrap'>
                            <button
                              type='button'
                              className={`btn-line type02 color01 ${
                                selectedSteps.includes('step1') ? 'active' : ''
                              }`}
                              data-step='step1'
                              onClick={() => handleStepButtonClick('step1')}
                            >
                              최하
                            </button>
                            <button
                              type='button'
                              className={`btn-line type02 color02 ${
                                selectedSteps.includes('step2') ? 'active' : ''
                              }`}
                              data-step='step2'
                              onClick={() => handleStepButtonClick('step2')}
                            >
                              하
                            </button>
                            <button
                              type='button'
                              className={`btn-line type02 color03 ${
                                selectedSteps.includes('step3') ? 'active' : ''
                              }`}
                              data-step='step3'
                              onClick={() => handleStepButtonClick('step3')}
                            >
                              중
                            </button>
                            <button
                              type='button'
                              className={`btn-line type02 color04 ${
                                selectedSteps.includes('step4') ? 'active' : ''
                              }`}
                              data-step='step4'
                              onClick={() => handleStepButtonClick('step4')}
                            >
                              상
                            </button>
                            <button
                              type='button'
                              className={`btn-line type02 color05 ${
                                selectedSteps.includes('step5') ? 'active' : ''
                              }`}
                              data-step='step5'
                              onClick={() => handleStepButtonClick('step5')}
                            >
                              최상
                            </button>
                          </div>
                        </div>
                        {/* 난이도별 문제수 */}
                        <div className='box'>
                          <div className='title-wrap'>
                            <span className='tit-text'>
                              난이도별 문제 수
                              <button
                                type='button'
                                className='btn-icon2 pop-btn'
                                data-pop='que-range-pop'
                              >
                                <i className='setting'></i>
                              </button>
                            </span>
                          </div>
                          <div className='range-wrap'>
                            <span
                              className={`range color01 ${
                                selectedSteps.includes('step1') ? '' : 'hide'
                              }`}
                              data-step='step1'
                            >
                              최하(n)
                            </span>
                            <span
                              className={`range color02 ${
                                selectedSteps.includes('step2') ? '' : 'hide'
                              }`}
                              data-step='step2'
                            >
                              하(n)
                            </span>
                            <span
                              className={`range color03 ${
                                selectedSteps.includes('step3') ? '' : 'hide'
                              }`}
                              data-step='step3'
                            >
                              중(n)
                            </span>
                            <span
                              className={`range color04 ${
                                selectedSteps.includes('step4') ? '' : 'hide'
                              }`}
                              data-step='step4'
                            >
                              상(n)
                            </span>
                            <span
                              className={`range color05 ${
                                selectedSteps.includes('step5') ? '' : 'hide'
                              }`}
                              data-step='step5'
                            >
                              최상(n)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='bottom-box'>
                        <p className='total-num'>
                          총 <span>{range}</span>문제
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            {/* 하단 버튼 */}
            <div className='step-btn-wrap'>
              <button type='button' className='btn-step'>
                출제 방법 선택
              </button>
              <button
                type='button'
                className='btn-step next pop-btn'
                data-pop='que-pop'
                onClick={()=>moveToPath('/exam/step2')}
              >
                STEP2 문항 편집
              </button>
            </div>
          </div>
          <div className='dim'></div>
    
          {/* 난이도별 문제 수 설정 팝업 */}
          <div className='pop-wrap range-type' data-pop='que-range-pop'>
            {/* ... */}
          </div>
    
          {/* 문항 충족하지 않을 시 팝업 */}
          <div className='pop-wrap range-type02' data-pop='que-pop'>
            {/* ... */}
          </div>
        </div>
      );
    };
    

  
  export default Step1Component;
