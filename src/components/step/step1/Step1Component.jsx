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
  onCancel, 
  onConfirm 
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

          {tempDifficultyCounts && tempDifficultyCounts.length > 0 && (
            <div className="diff-box">
              <p className="sub-title">검색된 난이도별 문항 수:</p>
              <div className="diff-list">
                {tempDifficultyCounts.map(({ level, count, targetCount, adjustedCount }) => (
                  <div key={level} className="diff-item">
                    <span className="diff-label">{level}:</span>
                    <div className="diff-count-wrap">
                      <span className={`diff-count ${count < targetCount ? 'warning' : ''}`}>
                        {count}문제
                        {count > 0 && targetCount > 0 && (
                          <span className="diff-adjusted">
                            {" "}→ {adjustedCount}문제 사용
                          </span>
                        )}
                      </span>
                      {count === 0 && targetCount > 0 && (
                        <span className="diff-warning">문항 없음</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="btn-wrap">
          <button type="button" className="btn-line" onClick={onCancel}>
            취소
          </button>
          <button type="button" className="btn-line blue" onClick={onConfirm}>
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
  
  // topic level 체크
  const isTopicLevel = actualId.length === 12;

  // countsData에서 매칭되는 데이터 찾기
  const countObj = isTopicLevel ? Object.values(countsData).find(
    item => item?.topicChapterId?.toString() === actualId
  ) : null;
  
  const count = countObj?.itemCount;

  // 디버깅 로그 추가
  console.log('Component Debug:', {
    title,
    actualId,
    isTopicLevel,
    countsData,
    countObj,
    count
  });

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
              // 체크박스도 토글
              if (!isChecked) {
                onCheckChange({ target: { checked: true } });
              }
            }}
            style={{ textAlign: 'left', flex: 1 }}
          >
            {title}
            {isTopicLevel && ` (${countObj?.itemCount ?? 0})`}
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
                  {count ?? 0}
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

  // 평가 데이터 로드
  useEffect(() => {
    axios.get(`https://bsherpa.duckdns.org/books/external/evaluations?subjectId=${bookId}`)
        .then((response) => {
          console.log('Evaluation Response:', response.data);
          if (response.data.evaluationList) {
            setEvaluation(response.data.evaluationList);
          }
        })
        .catch((error) => {
          console.error('Error loading evaluation:', error);
        });
  }, [bookId]);




  
 // 챕터 데이터 로드
useEffect(() => {
  axios.post(`https://bsherpa.duckdns.org/step1/chapters/${bookId}`)
    .then((response) => {
      console.log('Chapter Response:', response.data);
      const transformed = transformData(response.data.chapterList);
      setHierarchyData(transformed);
      setChapterList(response.data.chapterList);
 
      // 모든 챕터의 데이터를 저장
      if (response.data.chapterList && response.data.chapterList.length > 0) {
        // 여기서 0번째 인덱스만 사용하고 있었네요
        // setCurriculumCode(response.data.chapterList[0].curriculumCode || '');
        // setSubjectId(response.data.chapterList[0].subjectId || '');
        
        // 수정된 부분: 모든 챕터 데이터 처리
        const chapterList = response.data.chapterList;
        console.log('전체 챕터 리스트:', chapterList);
 
        setCurriculumCode(chapterList[0].curriculumCode); // curriculumCode는 동일하므로 첫번째 값 사용
        setSubjectId(chapterList[0].subjectId); // subjectId도 동일하므로 첫번째 값 사용
        
        // 챕터별 ID 추출 - 모든 챕터의 데이터 수집
        const largeIds = [...new Set(chapterList.map(item => item.largeChapterId))];
        const mediumIds = [...new Set(chapterList.map(item => item.mediumChapterId))];
        const smallIds = [...new Set(chapterList.map(item => item.smallChapterId))];
 
        console.log('수집된 largeIds:', largeIds);
        console.log('수집된 mediumIds:', mediumIds);
        console.log('수집된 smallIds:', smallIds);
 
        // 상태 업데이트
        setLargeChapterId(largeIds);
        setMediumChapterId(mediumIds);
        setSmallChapterId(smallIds);
 
        // counts API 호출을 위한 데이터 구성
        const fetchCountsData = async () => {
          let allCounts = [];
 
          // 모든 챕터 조합에 대해 API 호출
          for (const large of largeIds) {
            const filteredMediums = mediumIds.filter(medium => 
              medium.toString().startsWith(large.toString())
            );
 
            for (const medium of filteredMediums) {
              const filteredSmalls = smallIds.filter(small => 
                small.toString().startsWith(medium.toString())
              );
 
              for (const small of filteredSmalls) {
                const requestData = {
                  curriculumCode: String(chapterList[0].curriculumCode),
                  subjectId: String(chapterList[0].subjectId),
                  largeChapterId: String(large),
                  mediumChapterId: String(medium),
                  smallChapterId: String(small)
                };
 
                console.log('API 요청 데이터:', requestData);
 
                try {
                  const countResponse = await axios.post(
                    'https://bsherpa.duckdns.org/questions/external/counts',requestData
                  );
                  console.log('countResponse@@@@@@@@@@@  '+countResponse)
                  if (countResponse.data.listTopicItemCount) {
                    allCounts = [...allCounts, ...countResponse.data.listTopicItemCount];
                    console.log(`${large}-${medium}-${small} 챕터의 응답:`, countResponse.data.listTopicItemCount);
                  }
                } catch (error) {
                  console.error('챕터 데이터 조회 오류:', requestData, error);
                }
              }
            }
          }
 
          console.log('수집된 모든 counts:', allCounts);
 
          // 매핑 및 중복 제거
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
 
        // counts 데이터 가져오기 실행
        fetchCountsData();
      }
    })
    .catch((error) => {
      console.error('Error loading chapters:', error);
    });
 }, [bookId]);



// i 태그 클릭 핸들러
const handleInfoClick = () => {
  setShowInfoModal(true);
};






  // 카운트 데이터 로드
  useEffect(() => {
    if (!curriculumCode || !subjectId) {
      console.log('Waiting for basic fields...');
      return;
    }
  
    const fetchAllChapterData = async () => {
      try {
        // response.data.chapterList의 첫 번째 항목만이 아닌 전체 데이터를 사용
        if (response.data.chapterList) {
          // 각 챕터별 고유한 ID 추출
          const uniqueLargeIds = [...new Set(response.data.chapterList.map(item => item.largeChapterId))];
          const uniqueMediumIds = [...new Set(response.data.chapterList.map(item => item.mediumChapterId))];
          const uniqueSmallIds = [...new Set(response.data.chapterList.map(item => item.smallChapterId))];
  
          // state 업데이트
          setLargeChapterId(uniqueLargeIds);
          setMediumChapterId(uniqueMediumIds);
          setSmallChapterId(uniqueSmallIds);
  
          let allCounts = [];
  
          // 모든 고유한 조합에 대해 API 호출
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
  
                console.log('Requesting with data:', requestData);
  
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
  
          // 결과 확인용 로그
          console.log('All collected counts:', allCounts);
  
          // 중복 제거 및 매핑
          const uniqueCounts = Object.values(
            allCounts.reduce((acc, item) => {
              const key = item.topicChapterId;
              if (!acc[key] || acc[key].itemCount < item.itemCount) {
                acc[key] = item;
              }
              return acc;
            }, {})
          );
  
          // 최종 매핑
          const mappedCounts = uniqueCounts.reduce((acc, item, index) => {
            acc[index + 1] = {
              topicChapterId: item.topicChapterId,
              itemCount: item.itemCount
            };
            return acc;
          }, {});
  
          console.log('Final mapped counts:', mappedCounts);
          setCountsData(mappedCounts);
        }
      } catch (error) {
        console.error('Error in fetchAllChapterData:', error);
      }
    };
  
    fetchAllChapterData();
  }, [curriculumCode, subjectId]);
  

  const handleToggle = (nodeId) => {
    setActiveNodes(prev =>
        prev.includes(nodeId)
            ? prev.filter(id => id !== nodeId)
            : [...prev, nodeId]
    );
  };
  useEffect(()=>{
    console.log( countsData)
  
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
  };

  const handleRangeInputChange = (event) => {
    setRange(event.target.value);
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
    axios.post('https://bsherpa.duckdns.org/questions/external/chapters', requestData)
      .then((response) => {
        const newTempItemList = [...response.data.itemList];
        console.log(response.data.itemList)
        console.log(requestData)
        // 기본 카운트 객체 초기화
        const counts = [
          {level: "하", count: 0, targetCount: difficultyCounts.step2},
          {level: "중", count: 0, targetCount: difficultyCounts.step3},
          {level: "상", count: 0, targetCount: difficultyCounts.step4},
        ];

        // 먼저 각 난이도별로 실제 문제 수를 계산
        newTempItemList.forEach(item => {
          const difficulty = counts.find(d => d.level === item.difficultyName);
          if (difficulty) difficulty.count += 1;
        });
        setModalData({
          tempItemList: newTempItemList,
          counts: counts,
          // ... 기타 필요한 데이터
        });
        setShowStep2Modal(true);
        // 각 난이도별로 목표 문제 수와 실제 문제 수를 비교하여 조정
        counts.forEach(difficulty => {
          if (difficulty.count > 0) {
            // 실제 문제 수가 목표보다 적으면 실제 문제 수를 사용
            if (difficulty.count < difficulty.targetCount) {
              difficulty.adjustedCount = difficulty.count;
            } else {
              // 실제 문제 수가 목표보다 많으면 목표 수를 사용
              difficulty.adjustedCount = difficulty.targetCount;
            }
          } else {
            // 해당 난이도의 문제가 없으면 0으로 설정
            difficulty.adjustedCount = 0;
          }
        });

        console.log('원본 문제 목록:', newTempItemList);
        console.log('난이도별 문제 수 현황:', counts);

        setTempItemList(newTempItemList);
        setTempDifficultyCounts(counts);

        // 현재 제출 데이터 저장
        setPendingSubmitData({
          range,
          selectedSteps,
          selectedEvaluation,
          selectedQuestiontype,
          source,
          bookId,
          checkedNodes,
          difficultyCounts,
          requestData,
          apiResponse: response.data,
          adjustedCounts: counts
        });

        setIsConfirmOpen(true);
      })
      .catch((error) => {
        console.error('API 오류:', error);
        console.error('오류 상세:', error.response?.data);
        alert('요청 처리 중 오류가 발생했습니다.');
      });
  };
  const submitToStep0 = () => {
    // 미리 가져온 location 사용
    moveToStepWithData('step0', { 
      data: {
        id: bookId,
        name: location.state?.data?.name,
        author: location.state?.data?.author
      }
    });
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
                                countsData={countsData}
                            />
                          </li>
                        </ul>
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
          details={Object.entries(difficultyCounts)
            .map(([key, value]) => ({
              level: getDifficultyLabel(key.replace('step', '')),
              count: value
            }))
            .filter(item => item.count > 0 && ['하', '중', '상'].includes(item.level))}
          tempDifficultyCounts={tempDifficultyCounts}
          onCancel={() => setShowStep2Modal(false)}
          onConfirm={() => {
            moveToStepWithData('step2', modalData);
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
                          {Array.isArray(evaluation) && evaluation.length > 0 ? (
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
                      countsData={countsData}
                      handleDifficultyCounts={handleDifficultyCounts}
                      handleIsConfirm={handleIsConfirm}
                      handleCloseDifficultyPopup={handleCloseDifficultyPopup}  // 추가
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