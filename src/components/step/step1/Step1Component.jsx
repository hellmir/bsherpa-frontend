import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useCustomMove from "../../../hooks/useCustomMove";
import {useLocation} from "react-router-dom";
import DifficultyDisplay from './DifficultyDisplay.jsx';


// InfoModal.jsx - 정보 표시용 모달
const InfoModal = ({ 
  title, 
  message, 
  details,
  onClose 
}) => {
  return (
    <div className="pop-wrap range-type02" style={{ display: 'block' }}>
      <div className="pop-content">
        <div className="title-wrap">
          <h3>{title}</h3>
        </div>
        <div className="content-wrap">
          <p className="txt-desc">{message}</p>
          
          <div className="diff-box">
            <p className="sub-title">설정된 난이도별 문항 수:</p>
            <div className="diff-list">
              {details?.map(({ level, count }) => count > 0 && (
                <div key={level} className="diff-item">
                  <span className="diff-label">{level}:</span>
                  <span className="diff-count">{count}문제</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="btn-wrap">
          <button type="button" className="btn-line blue" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
      
      <style jsx="true">{`
        /* 기존 스타일 유지 */
      `}</style>
    </div>
  );
};

// Step2Modal.jsx - Step2 진행을 위한 모달
const Step2Modal = ({ 
  title, 
  message, 
  details,
  tempDifficultyCounts,
  range, // 사용자가 선택한 총 문제 수
  onCancel, 
  onConfirm 
}) => {
  const [adjustedCounts, setAdjustedCounts] = useState([]);
  const totalQuestions = parseInt(range);

  useEffect(() => {
    if (tempDifficultyCounts) {
      // 실제 문제가 있는 난이도만 필터링
      const availableDifficulties = tempDifficultyCounts.filter(diff => diff.count > 0);
      
      if (availableDifficulties.length === 0) {
        setAdjustedCounts([]);
        return;
      }

      // 전체 가용 문제 수 계산
      const totalAvailable = availableDifficulties.reduce((sum, diff) => sum + diff.count, 0);
      
      // 실제 문제 수가 요청한 문제 수보다 적은 경우
      if (totalAvailable <= totalQuestions) {
        // 실제 존재하는 문제 수만큼만 설정
        const adjusted = tempDifficultyCounts.map(diff => {
          return {
            ...diff,
            adjustedCount: diff.count,
            ratio: totalAvailable > 0 ? diff.count / totalAvailable : 0
          };
        });
        setAdjustedCounts(adjusted);
        return;
      }

      // 충분한 문제가 있는 경우 균등 배분
      const baseRatio = 1 / availableDifficulties.length;
      
      const adjusted = tempDifficultyCounts.map(diff => {
        if (diff.count === 0) {
          return {
            ...diff,
            adjustedCount: 0,
            ratio: 0
          };
        }

        const targetCount = Math.floor(totalQuestions * baseRatio);
        
        return {
          ...diff,
          adjustedCount: Math.min(diff.count, targetCount),
          ratio: baseRatio
        };
      });

      let actualTotal = adjusted.reduce((sum, diff) => sum + diff.adjustedCount, 0);
      
      // 남은 문제 수가 있다면 가용한 난이도에 추가 배분
      while (actualTotal < totalQuestions) {
        const availableForMore = adjusted.filter(diff => 
          diff.count > diff.adjustedCount
        );

        if (availableForMore.length === 0) break;

        availableForMore.sort((a, b) => 
          (a.adjustedCount / a.count) - (b.adjustedCount / b.count)
        );

        const idx = adjusted.findIndex(diff => diff.level === availableForMore[0].level);
        adjusted[idx].adjustedCount += 1;
        actualTotal += 1;
      }

      // 최종 비율 계산
      adjusted.forEach(diff => {
        diff.ratio = actualTotal > 0 ? diff.adjustedCount / actualTotal : 0;
      });

      setAdjustedCounts(adjusted);
    }
  }, [tempDifficultyCounts, totalQuestions]);
  return (
    <div className="pop-wrap range-type02" style={{ display: 'block' }}>
      <div className="pop-content">
        <div className="title-wrap">
          <h3>{title}</h3>
        </div>
        <div className="content-wrap">
          <p className="txt-desc">
            원하는 문항 구성을 할 수 없어 문항 구성이 자동으로 변경되었습니다.
            <br />
            <span className="total-questions">
              요청하신 {totalQuestions}문제 중{' '}
              {adjustedCounts.reduce((sum, item) => sum + item.adjustedCount, 0)}문제가
              검색되어 자동 배분되었습니다.
            </span>
          </p>

          <div className="diff-box">
            <p className="sub-title">검색된 난이도별 문항 수:</p>
            <div className="diff-list">
              {adjustedCounts.map((diff) => (
                <div key={diff.level} className="diff-item">
                  <span className="diff-label">{diff.level}:</span>
                  <div className="diff-count-wrap">
                    <span className="diff-count">
                      {diff.count}문제
                      {diff.count > 0 && (
                        <span className="diff-adjusted">
                          {" "}→ {diff.adjustedCount}문제 사용
                          <span className="distribution-ratio">
                            {" "}({Math.round(diff.ratio * 100)}%)
                          </span>
                        </span>
                      )}
                    </span>
                    {diff.count === 0 && (
                      <span className="diff-warning">문항 없음</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="btn-wrap">
          <button type="button" className="btn-line" onClick={onCancel}>
            취소
          </button>
          <button 
            type="button" 
            className="btn-line blue" 
            onClick={() => onConfirm(adjustedCounts)}
          >
            확인
          </button>
        </div>
      </div>
      
<style jsx="true">{`
  .pop-wrap {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 400px;
  }
  
  .pop-content {
    padding: 24px;
  }
  
  .title-wrap {
    margin-bottom: 16px;
  }
  
  .title-wrap h3 {
    font-size: 18px;
    font-weight: bold;
  }
  
  .txt-desc {
    margin-bottom: 16px;
    color: #666;
  }
  
  .diff-box {
    margin-bottom: 20px;
  }
  
  .sub-title {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .diff-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .diff-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 4px;
  }
  
  .diff-label {
    color: #666;
  }

  .diff-count-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .diff-count {
    font-weight: 600;
  }

  .diff-count.warning {
    color: #ff9800;
  }

  .diff-adjusted {
    font-size: 0.9em;
    color: #2196f3;
    margin-left: 4px;
  }

  .distribution-ratio {
    color: #666;
    font-size: 0.9em;
  }

  .diff-warning {
    font-size: 0.9em;
    color: #f44336;
  }
  
  .btn-wrap {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
  }
  
  .btn-line {
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-line:hover {
    background: #f5f5f5;
  }
  
  .btn-line.blue {
    background: #2196f3;
    color: #fff;
    border-color: #2196f3;
  }
  
  .btn-line.blue:hover {
    background: #1976d2;
  }

  .total-questions {
    color: #2196f3;
    font-weight: bold;
    display: block;
    margin-top: 8px;
  }

  /* 배경색 관련 스타일 추가 */
  .pop-wrap::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .content-wrap {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
  }

  .diff-box {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
  }

  .diff-item {
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    padding: 12px;
    border-radius: 6px;
  }
`}</style>
    </div>
  );
};






      













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

// 체크된 노드의 실제 데이터를 찾는 함수
const findNodeData = (nodeId, data) => {
  const id = nodeId.replace('node-', '');
  let foundNode = null;

  const search = (currentData) => {
    Object.values(currentData).forEach(node => {
      if (`${node.id}` === id) {
        foundNode = node;
        return;
      }
      if (node.children) {
        search(node.children);
      }
    });
  };

  search(data);
  return foundNode;
};

// 체크된 노드들의 계층 구조를 유지하면서 데이터 추출
const extractCheckedNodesData = (checkedNodes, hierarchyData) => {
  const checkedData = [];

  checkedNodes.forEach(nodeId => {
    const nodeData = findNodeData(nodeId, hierarchyData);
    if (nodeData) {
      checkedData.push({
        id: nodeData.id,
        name: nodeData.name,
        level: nodeId.split('-')[1].length === 1 ? 'large' :
            nodeId.split('-')[1].length === 2 ? 'medium' :
                nodeId.split('-')[1].length === 3 ? 'small' : 'topic'
      });
    }
  });

  return checkedData;
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
  depth = 0,
  countsData
}) => {
  const checkboxRef = React.useRef();

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // node-id에서 실제 ID 추출
  const actualId = id.replace('node-', '');
  
  // topic level 체크 (12자리 숫자인지 확인)
  const isTopicLevel = actualId.length === 12;

  // countsData에서 매칭되는 데이터 찾기
  const countObj = isTopicLevel ? 
    // Object.values로 배열로 변환하여 찾기
    Object.values(countsData).find(
      item => item?.topicChapterId?.toString() === actualId.toString()
    ) : null;

//  console.log('ID:', actualId, 'CountObj:', countObj, 'CountsData:', countsData); // 디버깅용

  // itemCount가 undefined인 경우 0으로 표시
  const count = countObj?.itemCount || 0;

  return (
    <div className={`check-group title ${isActive ? 'on' : ''}`}>
      <div className="title-chk" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        paddingLeft: `${depth * 20}px`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <input
            ref={checkboxRef}
            type="checkbox"
            id={id}
            checked={isChecked}
            onChange={onCheckChange}
            className="que-allCheck depth01"
          />
          <label 
            htmlFor={id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flex: 1,
              marginRight: '10px'
            }}
          >
            <button
              type="button"
              className={`dep-btn ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                onToggle();
                if (!isChecked) {
                  onCheckChange({ target: { checked: true } });
                }
              }}
              style={{ textAlign: 'left', flex: 1 }}
            >
              {title}
              {isTopicLevel && ` (${count})`}
            </button>
            {isTopicLevel && (
              <div className="count-display" style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '10px',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                fontSize: '0.9em',
                color: '#666',
                border: '1px solid #e0e0e0'
              }}>
                <span style={{ marginRight: '4px' }}>문항수</span>
                <strong style={{ 
                  color: '#2196f3',
                  fontWeight: 'bold' 
                }}>
                  {count}
                </strong>
              </div>
            )}
          </label>
        </div>
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
const RenderHierarchy = ({
  data,
  activeNodes,
  checkedNodes,
  onToggle,
  onCheckChange,
  depth = 0,
  hierarchyData,
  countsData = []
}) => {
  return Object.entries(data).map(([key, value]) => {
    const hasChildren = Object.keys(value.children || {}).length > 0;
    const nodeId = `node-${value.id}`;
    
    // 소단원 체크 및 카운트 데이터 가져오기
    const isSmallChapter = value.id.toString().length === 3;
    const itemCount = isSmallChapter ? countsData[value.id] : undefined;

    const childNodeIds = hasChildren ? getAllChildNodeIds(value) : [];
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

          if (newChecked) {
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
            newCheckedNodes = newCheckedNodes.filter(id => id !== nodeId);
            if (hasChildren) {
              const childIds = getAllChildNodeIds(value);
              newCheckedNodes = newCheckedNodes.filter(id => !childIds.includes(id));
            }
            newCheckedNodes = updateParentNodes(nodeId, newCheckedNodes);
          }

          onCheckChange(newCheckedNodes);
        }}
        depth={depth}
        countsData={countsData}
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
            countsData={countsData}
          />
        )}
      </DynamicAccordionItem>
    );
  });
};


// 로딩 스피너 컴포넌트
const LoadingSpinner = () => (
  <div className="loading-container" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div className="loading-spinner" style={{
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '8px'
    }} />
    <span>로딩중...</span>
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);



const Step1Component = () => {
  const [hierarchyData, setHierarchyData] = useState({});
  const [activeNodes, setActiveNodes] = useState([]);
  const [checkedNodes, setCheckedNodes] = useState([]);
  const [range, setRange] = useState('30');
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState([]);
  const [selectedQuestiontype, setSelectedQuestiontype] = useState('');
  const [source, setSource] = useState('');
  const {moveToStepWithData} = useCustomMove();
  const bookId = useLocation().state.data;
  const [evaluation, setEvaluation] = useState({});
  const [curriculumCode, setCurriculumCode] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [largeChapterId, setLargeChapterId] = useState('');
  const [mediumChapterId, setMediumChapterId] = useState('');
  const [smallChapterId, setSmallChapterId] = useState('');
  const [topicChapterId, setTopicChapterId] = useState('');
  const  [smallCounts, setSmallCounts] = useState([]);
  const [countsData, setCountsData] = useState([]);
  const [itemList ,setItemList] = useState([]);
  const [chapterList, setChapterList] = useState([]);
  const [tempDifficultyCounts, setTempDifficultyCounts] = useState([]);
  const [tempItemList, setTempItemList] = useState([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState(true);
  const [name ,setName] = useState('')
  const [author ,setAuthor] = useState('')
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showStep2Modal, setShowStep2Modal] = useState(false);
  const [modalData, setModalData] = useState(null);
  // 확인 모달 관련 상태
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // 제출 대기 중인 데이터 상태
  const [pendingSubmitData, setPendingSubmitData] = useState(null);

  // 난이도 카운트 초기값 설정
  const [difficultyCounts, setDifficultyCounts] = useState({
    step1: 0,
    step2: 10,
    step3: 10,
    step4: 10,
    step5: 0
  });
  

  const location = useLocation();

  // CSS 스타일시트 로딩
  useEffect(() => {
    const commonLink = document.createElement("link");
    commonLink.href = "https://ddipddipddip.s3.ap-northeast-2.amazonaws.com/tsherpa-css/common.css";
    commonLink.rel = "stylesheet";
    document.head.appendChild(commonLink);

    const fontLink = document.createElement("link");
    fontLink.href = "https://ddipddipddip.s3.ap-northeast-2.amazonaws.com/tsherpa-css/font.css";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    const resetLink = document.createElement("link");
    resetLink.href = "https://ddipddipddip.s3.ap-northeast-2.amazonaws.com/tsherpa-css/reset.css";
    resetLink.rel = "stylesheet";
    document.head.appendChild(resetLink);

    return () => {
      document.head.removeChild(commonLink);
      document.head.removeChild(fontLink);
      document.head.removeChild(resetLink);
    };
  }, []);

    // 평가 영역 데이터 로드
    useEffect(() => {
      setIsLoadingEvaluation(true);
      axios.get(`https://bsherpa.duckdns.org/books/external/evaluations?subjectId=${bookId}`)
        .then((response) => {
          if (response.data.evaluationList) {
            setEvaluation(response.data.evaluationList);
          }
        })
        .catch((error) => {
          console.error('Error loading evaluation:', error);
        })
        .finally(() => {
          setIsLoadingEvaluation(false);
        });
    }, [bookId]);
  



   // 챕터 데이터 로드
   useEffect(() => {
    setIsLoadingChapters(true); // 로딩 시작
    axios.post(`https://bsherpa.duckdns.org/step1/chapters/${bookId}`)
      .then((response) => {
        console.log('Chapter Response:', response.data);
        const transformed = transformData(response.data.chapterList);
        console.log(response.data.chapterList[0].subjectName);
        let subjectName = response.data.chapterList[0].subjectName;

        // 방법 2: 더 간단한 문자열 처리
        const openBracketIndex = subjectName.indexOf('(');
        const closeBracketIndex = subjectName.indexOf(')');

        const subject2 = subjectName.slice(0, openBracketIndex);
        const teacher2 = subjectName.slice(openBracketIndex + 1, closeBracketIndex);
        setName(subject2)
        setAuthor(teacher2)
        console.log('subject2'+subject2);  // "수학1"
        console.log('teacher2'+teacher2);  // "류희찬"

        setHierarchyData(transformed);
        setChapterList(response.data.chapterList);
  
        if (response.data.chapterList && response.data.chapterList.length > 0) {
          const chapterList = response.data.chapterList;
          console.log('전체 챕터 리스트:', chapterList);
  
          setCurriculumCode(chapterList[0].curriculumCode);
          setSubjectId(chapterList[0].subjectId);
          
          const largeIds = [...new Set(chapterList.map(item => item.largeChapterId))];
          const mediumIds = [...new Set(chapterList.map(item => item.mediumChapterId))];
          const smallIds = [...new Set(chapterList.map(item => item.smallChapterId))];
  
          setLargeChapterId(largeIds);
          setMediumChapterId(mediumIds);
          setSmallChapterId(smallIds);
  
          const fetchCountsData = async () => {
            let allCounts = [];
            // ... (기존 fetchCountsData 로직)
            
            const mappedCounts = allCounts.reduce((acc, item, index) => {
              acc[index + 1] = {
                topicChapterId: item.topicChapterId,
                itemCount: item.itemCount
              };
              return acc;
            }, {});
  
            console.log('최종 매핑된 counts:', mappedCounts);
            setCountsData(mappedCounts);
          };
  
          fetchCountsData();
        }
      })
      .catch((error) => {
        console.error('Error loading chapters:', error);
      })
      .finally(() => {
        setIsLoadingChapters(false); // 로딩 완료 - 성공하든 실패하든 로딩 상태 해제
      });
  }, [bookId]);



// i 태그 클릭 핸들러
const handleInfoClick = () => {
  setShowInfoModal(true);
};






  // 카운트 데이터 로드
 // counts 데이터를 가져오는 useEffect 수정
useEffect(() => {
  if (!curriculumCode || !subjectId) {
    console.log('Waiting for basic fields...');
    return;
  }

  const fetchAllChapterData = async () => {
    try {
      if (chapterList && chapterList.length > 0) {
        const uniqueLargeIds = [...new Set(chapterList.map(item => item.largeChapterId))];
        const uniqueMediumIds = [...new Set(chapterList.map(item => item.mediumChapterId))];
        const uniqueSmallIds = [...new Set(chapterList.map(item => item.smallChapterId))];

        let allCounts = [];

        for (const largeId of uniqueLargeIds) {
          const relatedMediumIds = uniqueMediumIds.filter(mediumId => 
            mediumId.toString().startsWith(largeId.toString())
          );

          for (const mediumId of relatedMediumIds) {
            const relatedSmallIds = uniqueSmallIds.filter(smallId => 
              smallId.toString().startsWith(mediumId.toString())
            );

            for (const smallId of relatedSmallIds) {
              const requestData = {
                curriculumCode: String(curriculumCode),
                subjectId: String(subjectId),
                largeChapterId: String(largeId),
                mediumChapterId: String(mediumId),
                smallChapterId: String(smallId)
              };

              try {
                const response = await axios.post(
                  'https://bsherpa.duckdns.org/questions/external/counts', 
                  requestData
                );

                if (response.data.listTopicItemCount) {
                  allCounts = [...allCounts, ...response.data.listTopicItemCount];
                }
              } catch (error) {
                console.error(`Error fetching data for chapter combination:`, requestData, error);
              }
            }
          }
        }

        // 중복 제거 및 매핑 - topicChapterId를 키로 사용
        const mappedCounts = allCounts.reduce((acc, item) => {
          const key = item.topicChapterId;
          if (!acc[key] || acc[key].itemCount < item.itemCount) {
            acc[key] = {
              topicChapterId: item.topicChapterId,
              itemCount: item.itemCount
            };
          }
          return acc;
        }, {});

       // console.log('Final mapped counts:', mappedCounts);
        setCountsData(mappedCounts);
      }
    } catch (error) {
      console.error('Error in fetchAllChapterData:', error);
    }
  };

  fetchAllChapterData();
}, [curriculumCode, subjectId, chapterList]);





 const updateDifficultyDistribution = (totalQuestions) => {
    // 3:4:3 비율로 문제 수 계산
    const ratio = { low: 0.3, mid: 0.4, high: 0.3 };
    
    // 각 난이도별 문제 수 계산
    const lowCount = Math.round(totalQuestions * ratio.low);
    const midCount = Math.round(totalQuestions * ratio.mid);
    // 합이 전체 문제 수와 일치하도록 상 레벨 조정
    const highCount = totalQuestions - lowCount - midCount;

    setDifficultyCounts({
      step1: 0, // 최하
      step2: lowCount,  // 하
      step3: midCount,  // 중
      step4: highCount, // 상
      step5: 0  // 최상
    });
  };


  

  const handleToggle = (nodeId) => {
    setActiveNodes(prev =>
        prev.includes(nodeId)
            ? prev.filter(id => id !== nodeId)
            : [...prev, nodeId]
    );
  };
  useEffect(()=>{
    // console.log( countsData)
  
  })

 // 난이도 레벨 매핑 함수 추가
 const getDifficultyLabel = (level) => {
  const levelMap = {
    '2': '하',
    '3': '중',
    '4': '상'
  };
  return levelMap[level] || level;
};

const handleCloseDifficultyPopup = () => {
  setIsConfirmOpen(false); // 모달 닫기
};



  const handleCheckChange = (newCheckedNodes) => {
    // 체크된 노드가 하나라도 있으면 기본값 설정
    if (newCheckedNodes.length > 0) {
      // 출처 설정 - 교사용으로 기본 설정
      setSource('teacher');

      // 평가영역 설정 - 모든 항목 선택
      if (Array.isArray(evaluation) && evaluation.length > 0) {
        const allDomainIds = evaluation.map(item => item.domainId);
        setSelectedEvaluation(allDomainIds);
      }

      // 문제형태 설정 - 객관식과 주관식 모두 선택
      setSelectedQuestiontype('objective,subjective');
    }

    // 기존의 체크노드 업데이트 로직
    setCheckedNodes(newCheckedNodes);
    console.log('Updated checked nodes:', newCheckedNodes);
    
  };

  

  const handleRangeButtonClick = (value) => {
    setRange(value);
    const total = parseInt(value);
    
    // 각 난이도에 균등하게 배분
    const equalCount = Math.floor(total / 3); // 기본 배분 수
    const remainder = total % 3; // 나머지
    
    const newCounts = {
      step1: 0,
      step2: equalCount, // 하 - 기본 배분
      step3: equalCount + remainder, // 중 - 기본 배분 + 나머지
      step4: equalCount, // 상 - 기본 배분
      step5: 0
    };
    
    setDifficultyCounts(newCounts);
  };

  const handleRangeInputChange = (event) => {
    const value = event.target.value;
    setRange(value);
    const total = parseInt(value);
    
    if (!isNaN(total)) {
      // 각 난이도에 균등하게 배분
      const equalCount = Math.floor(total / 3); // 기본 배분 수
      const remainder = total % 3; // 나머지
      
      const newCounts = {
        step1: 0,
        step2: equalCount, // 하 - 기본 배분
        step3: equalCount + remainder, // 중 - 기본 배분 + 나머지
        step4: equalCount, // 상 - 기본 배분
        step5: 0
      };
      
      setDifficultyCounts(newCounts);
    }
  };
  const handleStepButtonClick = (step) => {
    setSelectedSteps(prev =>
        prev.includes(step)
            ? prev.filter(item => item !== step)
            : [...prev, step]
    );
  };


  
  const handleEvaluationButtonClick = (evaluation) => {
    setSelectedEvaluation(prev =>
        prev.includes(evaluation)
            ? prev.filter(item => item !== evaluation)
            : [...prev, evaluation]
    );
  };

   // 문제 형태 클릭 핸들러 수정
   const handleQuestionTypeClick = (questiontype) => {
    if (questiontype === 'objective' && selectedQuestiontype.includes('subjective')) {
      setSelectedQuestiontype('subjective');
    } else if (questiontype === 'objective') {
      setSelectedQuestiontype('objective');
    } else if (questiontype === 'subjective' && selectedQuestiontype.includes('objective')) {
      setSelectedQuestiontype('objective');
    } else if (questiontype === 'subjective') {
      setSelectedQuestiontype('subjective');
    } else {
      setSelectedQuestiontype('objective,subjective');
    }
  };

  const handleSourceClick = (sourceType) => {
    setSource(prev => prev === sourceType ? '' : sourceType);
  };
 // useEffect 부분도 수정
useEffect(() => {
  if (!curriculumCode || !subjectId || !largeChapterId || !mediumChapterId || !smallChapterId) {
    console.log('Waiting for all required fields...');
    return;
  }

  const requestData = {
    curriculumCode: String(curriculumCode),
    subjectId: String(subjectId),
    largeChapterId: String(largeChapterId),
    mediumChapterId: String(mediumChapterId),
    smallChapterId: String(smallChapterId)
  };

  console.log('Sending counts request with data:', requestData);
  axios.post('https://bsherpa.duckdns.org/questions/external/counts', requestData)
    .then((response) => {
      const itemCounts = response.data.listTopicItemCount;
      console.log('Raw itemCounts:', itemCounts);
      
      const mappedCounts = itemCounts.reduce((acc, item, index) => {
        acc[index + 1] = {
          topicChapterId: item.topicChapterId,
          itemCount: item.itemCount
        };
        return acc;
      }, {});
      
      console.log('Mapped counts data:', mappedCounts);
      setCountsData(mappedCounts);
    })
    .catch((error) => {
      console.error('Error loading counts:', error);
    });
}, [curriculumCode, subjectId, largeChapterId, mediumChapterId, smallChapterId]);
  

  // STEP2 제출 함수 수정
  // submitToStep2 함수를 수정하여 range에 맞는 itemList만 전달하도록 변경
const submitToStep2 = () => {
  const checkedNodesData = extractCheckedNodesData(checkedNodes, hierarchyData);
  
  const minorClassification = checkedNodesData.map(node => {
    const chapterData = chapterList.find(chapter => {
      const nodeIdStr = node.id.toString();
      return chapter.largeChapterId?.toString() === nodeIdStr ||
             chapter.mediumChapterId?.toString() === nodeIdStr ||
             chapter.smallChapterId?.toString() === nodeIdStr ||
             chapter.topicChapterId?.toString() === nodeIdStr;
    });
    
    if (!chapterData) return null;

    return {
      large: parseInt(chapterData.largeChapterId),
      medium: parseInt(chapterData.mediumChapterId),
      small: parseInt(chapterData.smallChapterId),
      subject: parseInt(chapterData.subjectId),
      topic: parseInt(chapterData.topicChapterId)
    };
  }).filter(item => item !== null);

  const activityCategoryList = Array.isArray(selectedEvaluation) 
    ? selectedEvaluation.map(item => 
        typeof item === 'object' && item.domainId 
          ? parseInt(item.domainId) 
          : parseInt(item)
      )
    : [];

  const levelCnt = [
    parseInt(difficultyCounts.step1) || 0,
    parseInt(difficultyCounts.step2) || 0,
    parseInt(difficultyCounts.step3) || 0,
    parseInt(difficultyCounts.step4) || 0,
    parseInt(difficultyCounts.step5) || 0
  ];

  let questionForm = '';
  if (selectedQuestiontype === 'objective') {
    questionForm = 'multiple,';
  } else if (selectedQuestiontype === 'subjective') {
    questionForm = 'subjective';
  } else if (selectedQuestiontype.includes('objective') && selectedQuestiontype.includes('subjective')) {
    questionForm = 'multiple,subjective';
  }

  // 필수 입력값 확인
  if (activityCategoryList.length === 0) {
    alert('평가 영역을 선택해주세요.');
    return;
  }

  if (minorClassification.length === 0) {
    alert('단원을 선택해주세요.');
    return;
  }

  if (!questionForm) {
    alert('문제 형태를 선택해주세요.');
    return;
  }

  const requestData = {
    activityCategoryList,
    levelCnt,
    minorClassification,
    questionForm
  };

  // API 호출
  axios.post('https://bsherpa.duckdns.org/question-images/external/chapters', requestData)
  .then((response) => {
    const itemList = response.data.itemList;
     // 문제 수가 0인 경우 체크 추가
    if (!itemList || itemList.length === 0) {
     if (!itemList || itemList.length === 0) {
      alert('선택한 단원에 사용 가능한 문제가 없습니다.\n다른 단원을 선택해주세요.');
      return;
    }
    const totalQuestions = parseInt(range);
    let selectedQuestions;
    let counts;

    if (itemList.length <= totalQuestions) {
      // 실제 아이템 수가 요청한 문제 수보다 적거나 같은 경우
      selectedQuestions = itemList;  // 전체 아이템 사용
      
      // 실제 존재하는 문제의 난이도별 카운트
      counts = [
        {level: "최하", count: 0, targetCount: 0, adjustedCount: 0},
        {level: "하", count: itemList.filter(item => item.difficultyName === "하").length,
         targetCount: itemList.filter(item => item.difficultyName === "하").length,
         adjustedCount: itemList.filter(item => item.difficultyName === "하").length},
        {level: "중", count: itemList.filter(item => item.difficultyName === "중").length,
         targetCount: itemList.filter(item => item.difficultyName === "중").length,
         adjustedCount: itemList.filter(item => item.difficultyName === "중").length},
        {level: "상", count: itemList.filter(item => item.difficultyName === "상").length,
         targetCount: itemList.filter(item => item.difficultyName === "상").length,
         adjustedCount: itemList.filter(item => item.difficultyName === "상").length},
        {level: "최상", count: 0, targetCount: 0, adjustedCount: 0}
      ];
    } else {
      // 충분한 문제가 있는 경우 균등 배분
      const equalCount = Math.floor(totalQuestions / 3);
      const remainder = totalQuestions % 3;

      const questionsByDifficulty = {
        "하": itemList.filter(item => item.difficultyName === "하"),
        "중": itemList.filter(item => item.difficultyName === "중"),
        "상": itemList.filter(item => item.difficultyName === "상")
      };

      // 각 난이도별로 필요한 수만큼 선택
      selectedQuestions = [
        ...questionsByDifficulty["하"].slice(0, equalCount),
        ...questionsByDifficulty["중"].slice(0, equalCount + remainder),
        ...questionsByDifficulty["상"].slice(0, equalCount)
      ];

      counts = [
        {level: "최하", count: 0, targetCount: 0, adjustedCount: 0},
        {level: "하", count: questionsByDifficulty["하"].length, targetCount: equalCount, adjustedCount: equalCount},
        {level: "중", count: questionsByDifficulty["중"].length, targetCount: equalCount + remainder, adjustedCount: equalCount + remainder},
        {level: "상", count: questionsByDifficulty["상"].length, targetCount: equalCount, adjustedCount: equalCount},
        {level: "최상", count: 0, targetCount: 0, adjustedCount: 0}
      ];
    }

    setModalData({
      tempItemList: selectedQuestions,
      counts: counts,
    });
    setShowStep2Modal(true);
    setTempItemList(selectedQuestions);
    setTempDifficultyCounts(counts);

    setPendingSubmitData({
      range: selectedQuestions.length.toString(),
      selectedSteps,
      selectedEvaluation,
      selectedQuestiontype,
      evaluationData: evaluation,
      source,
      bookId,
      checkedNodes,
      difficultyCounts: {
        step1: 0,
        step2: counts[1].adjustedCount,
        step3: counts[2].adjustedCount,
        step4: counts[3].adjustedCount,
        step5: 0
      },
      requestData,
      apiResponse: { ...response.data, itemList: selectedQuestions },
      adjustedCounts: counts,
      questionForm,
      activityCategoryList,
      minorClassification
    });

    setIsConfirmOpen(true);
  })
  .catch((error) => {
    console.error('API 오류:', error);
    console.error('오류 상세:', error.response?.data);
    alert('요청 처리 중 오류가 발생했습니다.');
  });
};

  
//submit to step2 끝






  const submitToStep0 = () => {
    moveToStepWithData(`step0`,{id:bookId,name:name ,author:author})
  };
 
   
  // 확인 모달 핸들러
  const handleConfirm = () => {
    if (!pendingSubmitData) return;
    
    moveToStepWithData('step2', pendingSubmitData);
    setIsConfirmOpen(false);
    setPendingSubmitData(null);
  };



const handleDifficultyCounts = (newCounts) => {
  setDifficultyCounts({
      step1: newCounts.step1,
      step2: newCounts.step2,
      step3: newCounts.step3,
      step4: newCounts.step4,
      step5: newCounts.step5
})
}
const handleIsConfirm = (isConfirm) => {
  setIsConfirmOpen(isConfirm)
}



  return (
      <div id="wrap" className="full-pop-que">
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
                  <span>{name}</span>
                  {author}(2015)
                </div>
              </div>

              <div className="view-bottom">
            <div className="view-box-wrap">
              <div className="unit-box-wrap">
                <div className="unit-box">
                  <div className="unit-cnt scroll-inner">
                    {isLoadingChapters ? (
                      <LoadingSpinner />
                    ) : (
                      <>
                     <div className="title-top">
  <span>단원정보</span>
  <input
    type="checkbox"
    id="allCheck"
    onChange={(e) => {
      const allNodeIds = getAllNodeIds(hierarchyData);
      
      if (e.target.checked) {
        // 전체 선택시
        // 1. 모든 노드 체크 및 아코디언 펼침
        setCheckedNodes(allNodeIds);
        setActiveNodes(allNodeIds);
        
        // 2. 출처 선택 (교사용으로 설정)
        setSource('teacher');
        
        // 3. 평가영역 전체 선택
        if (Array.isArray(evaluation)) {
          const allEvaluationIds = evaluation.map(item => item.domainId);
          setSelectedEvaluation(allEvaluationIds);
        }
        
        // 4. 문제형태 모두 선택 (객관식, 주관식)
        setSelectedQuestiontype('objective,subjective');
        
      } else {
        // 전체 해제시
        // 1. 모든 노드 체크 해제 및 아코디언 접기
        setCheckedNodes([]);
        setActiveNodes([]);
        
        // 2. 출처 선택 해제
        setSource('');
        
        // 3. 평가영역 선택 해제
        setSelectedEvaluation([]);
        
        // 4. 문제형태 선택 해제
        setSelectedQuestiontype('');
      }
    }}
    checked={checkedNodes.length > 0 && checkedNodes.length === getAllNodeIds(hierarchyData).length}
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
                              countsData={countsData}
                            />
                          </li>
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>



                  {showInfoModal && (
        <InfoModal
          title="난이도별 문항 수 정보"
          message="현재 설정된 난이도별 문항 수입니다."
          details={Object.entries(difficultyCounts)
            .map(([key, value]) => ({
              level: getDifficultyLabel(key.replace('step', '')),
              count: value
            }))
            .filter(item => item.count > 0 && ['하', '중', '상'].includes(item.level))}
          onClose={() => setShowInfoModal(false)}
        />
      )}

{showStep2Modal && modalData && (
  <Step2Modal
    title="문항 구성 자동 변경"
    message="문항 구성이 자동으로 변경됩니다."
    tempDifficultyCounts={tempDifficultyCounts}
    range={range}
    onCancel={() => setShowStep2Modal(false)}
    onConfirm={(adjustedCounts) => {
      if (pendingSubmitData) {
        // 자동 구성된 난이도별 카운트를 difficultyCounts 형식으로 변환
        const newDifficultyCounts = {
          step1: 0, // 최하 난이도는 0으로 유지
          step2: adjustedCounts.find(count => count.level === "하")?.adjustedCount || 0,
          step3: adjustedCounts.find(count => count.level === "중")?.adjustedCount || 0,
          step4: adjustedCounts.find(count => count.level === "상")?.adjustedCount || 0,
          step5: 0  // 최상 난이도는 0으로 유지
        };

        // difficultyCounts 상태 업데이트
        setDifficultyCounts(newDifficultyCounts);

        moveToStepWithData('step2', {
          ...pendingSubmitData,
          tempItemList: modalData.tempItemList,
          counts: modalData.counts,
          adjustedCounts: adjustedCounts,
          selectedEvaluation,
          selectedQuestiontype,
          evaluationData: evaluation,
          questionForm: pendingSubmitData.questionForm,
          activityCategoryList: pendingSubmitData.activityCategoryList,
          difficultyCounts: newDifficultyCounts  // 업데이트된 difficultyCounts 전달
        });
      }
      setShowStep2Modal(false);
    }}
  />
)}


      
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
                          <button type="button"
                            className={`px-4 py-2 rounded-lg transition-colors
                              ${source === 'student' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              } 
                              disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={() => handleSourceClick('student')}
                            disabled={true}
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
                      {isLoadingEvaluation ? (
                        <LoadingSpinner />
                      ) : Array.isArray(evaluation) && evaluation.length > 0 ? (
                        evaluation.map(item => (
                          <button
                            key={item.domainId}
                            type="button"
                            className={`btn-line ${selectedEvaluation.includes(item.domainId) ? 'active' : ''}`}
                            onClick={() => handleEvaluationButtonClick(item.domainId)}
                          >
                            {item.domainName}
                          </button>
                        ))
                      ) : (
                        <div>데이터가 없습니다.</div>
                      )}
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
                        className={`btn-line ${
                          selectedQuestiontype.includes('objective') ? 'active' : ''
                        }`}
                        data-step='objective'
                        onClick={() => handleQuestionTypeClick('objective')}
                      >
                        객관식
                      </button>
                      <button
                        type='button'
                        className={`btn-line ${
                          selectedQuestiontype.includes('subjective') ? 'active' : ''
                        }`}
                        data-step='subjective'
                        onClick={() => handleQuestionTypeClick('subjective')}
                      >
                        주관식
                      </button>
                    </div>
                  </div>


                  <DifficultyDisplay 
  isStudent={false}
  countsData={difficultyCounts} // difficultyCounts 상태를 직접 전달
  handleDifficultyCounts={handleDifficultyCounts}
  handleIsConfirm={handleIsConfirm}
  handleCloseDifficultyPopup={handleCloseDifficultyPopup}
/>


                      {/* 난이도별 문제수 */}

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

        {/* 수정된 확인 모달 */}
    





      {/* 하단 버튼 */}
      <div className='step-btn-wrap'>
        <button type='button' className='btn-step'
        onClick={submitToStep0}>
          출제 방법 선택
        </button>
        <button
          type='button'
          className='btn-step next pop-btn'
          data-pop='que-pop'
          onClick={submitToStep2}
        >
          STEP2 문항 편집
        </button>
      </div>
      
      <div className='dim'></div>
    </div>

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

