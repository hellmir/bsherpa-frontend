import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useCustomMove from "../../../hooks/useCustomMove";
import {useLocation} from "react-router-dom";
import DifficultyDisplay from './DifficultyDisplay.jsx';

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
      if (node.id.toString() === id) {
        foundNode = {
          id: node.id,
          name: node.name,
          children: node.children
        };
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
      const id = nodeData.id.toString();
      checkedData.push({
        id: parseInt(id),
        name: nodeData.name,
        level: id.length === 1 ? 'large' :
               id.length === 2 ? 'medium' :
               id.length === 3 ? 'small' : 'topic'
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
  itemCount
}) => {
  const checkboxRef = React.useRef();

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // 소단원인지 확인 (id가 3자리 숫자인 경우)
  const isSmallChapter = id.replace('node-', '').length === 3;

  const handleCheckboxChange = (e) => {
    console.log('Checkbox changed:', id, e.target.checked);
    onCheckChange(e);
  };

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
          onChange={handleCheckboxChange}
          className="que-allCheck depth01"
        />
        <label htmlFor={id} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            className={`dep-btn ${isActive ? 'active' : ''}`}
            onClick={onToggle}
            style={{ textAlign: 'left' }}
          >
            {title}
          </button>
          {isSmallChapter && itemCount !== undefined && (
            <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              {itemCount}문제
            </span>
          )}
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
const RenderHierarchy = ({
  data,
  activeNodes,
  checkedNodes,
  onToggle,
  onCheckChange,
  depth = 0,
  hierarchyData,
  countsData = {}
}) => {
  return Object.entries(data).map(([key, value]) => {
    const hasChildren = Object.keys(value.children || {}).length > 0;
    const nodeId = `node-${value.id}`;
    
    const isSmallChapter = value.id.toString().length === 3;
    const itemCount = isSmallChapter ? countsData[value.id] : undefined;

    const childNodeIds = hasChildren ? getAllChildNodeIds(value) : [];
    const checkedChildCount = childNodeIds.filter(id => checkedNodes.includes(id)).length;
    const isIndeterminate = hasChildren && checkedChildCount > 0 && checkedChildCount < childNodeIds.length;
    const isChecked = hasChildren ? checkedChildCount === childNodeIds.length : checkedNodes.includes(nodeId);

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
            if (!newCheckedNodes.includes(nodeId)) {
              newCheckedNodes.push(nodeId);
            }
            if (hasChildren) {
              childNodeIds.forEach(id => {
                if (!newCheckedNodes.includes(id)) {
                  newCheckedNodes.push(id);
                }
              });
            }
          } else {
            newCheckedNodes = newCheckedNodes.filter(id => id !== nodeId);
            if (hasChildren) {
              newCheckedNodes = newCheckedNodes.filter(id => !childNodeIds.includes(id));
            }
          }

          // Update parent nodes
          let currentNodeId = nodeId;
          while (true) {
            const parentId = getParentNodeId(hierarchyData, currentNodeId);
            if (!parentId) break;

            const parentChildIds = getAllChildNodeIds(findNodeData(parentId, hierarchyData));
            const allChildrenChecked = parentChildIds.every(id => newCheckedNodes.includes(id));
            
            if (allChildrenChecked && !newCheckedNodes.includes(parentId)) {
              newCheckedNodes.push(parentId);
            } else if (!allChildrenChecked) {
              newCheckedNodes = newCheckedNodes.filter(id => id !== parentId);
            }
            
            currentNodeId = parentId;
          }

          onCheckChange(newCheckedNodes);
        }}
        depth={depth}
        itemCount={itemCount}
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
  const [evaluation, setEvaluation] = useState([]);
  const [curriculumCode, setCurriculumCode] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [largeChapterId, setLargeChapterId] = useState('');
  const [mediumChapterId, setMediumChapterId] = useState('');
  const [smallChapterId, setSmallChapterId] = useState('');
  const [countsData, setCountsData] = useState({});
  const [chapterList, setChapterList] = useState([]);
  const [difficultyCounts, setDifficultyCounts] = useState({
    step1: 1,
    step2: 10,
    step3: 10,
    step4: 10,
    step5: 1
  });

  const handleDifficultyCountsChange = (counts) => {
    setDifficultyCounts(counts);
  };

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
        if (response.data.chapterList) {
          const transformed = transformData(response.data.chapterList);
          setHierarchyData(transformed);
          setChapterList(response.data.chapterList);

          // 첫 번째 챕터의 데이터로 초기화
          const firstChapter = response.data.chapterList[0];
          if (firstChapter) {
            setCurriculumCode(firstChapter.curriculumCode || '');
            setSubjectId(firstChapter.subjectId || '');
            setLargeChapterId(firstChapter.largeChapterId || '');
            setMediumChapterId(firstChapter.mediumChapterId || '');
            setSmallChapterId(firstChapter.smallChapterId || '');
          }
        }
      })
      .catch((error) => {
        console.error('Error loading chapters:', error);
      });
  }, [bookId]);

  // 카운트 데이터 로드
  useEffect(() => {
    if (!curriculumCode || !subjectId || !largeChapterId || !mediumChapterId || !smallChapterId) {
      console.log('Waiting for required fields...');
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
        console.log('Counts Response:', response.data);
        if (response.data.listTopicItemCount) {
          const countsMap = {};
          response.data.listTopicItemCount.forEach(item => {
            countsMap[item.smallChapterId] = item.itemCount;
          });
          setCountsData(countsMap);
        }
      })
      .catch((error) => {
        console.error('Error loading counts:', error);
      });
  }, [curriculumCode, subjectId, largeChapterId, mediumChapterId, smallChapterId]);

  const handleToggle = (nodeId) => {
    setActiveNodes(prev =>
      prev.includes(nodeId)
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleCheckChange = (newCheckedNodes) => {
    console.log('Updating checked nodes:', newCheckedNodes);
    setCheckedNodes(newCheckedNodes);
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

  const handleQuestionTypeClick = (questiontype) => {
    setSelectedQuestiontype(prev => prev === questiontype ? '' : questiontype);
  };

  const handleSourceClick = (sourceType) => {
    setSource(prev => prev === sourceType ? '' : sourceType);
  };

  const submitToStep2 = () => {
    console.log('Starting submitToStep2...');
    
    // 기본 유효성 검사
    if (!checkedNodes.length) {
      alert('단원을 선택해주세요.');
      return;
    }
    if (selectedEvaluation.length === 0) {
      alert('평가 영역을 선택해주세요.');
      return;
    }
    if (!selectedQuestiontype) {
      alert('문제 형태를 선택해주세요.');
      return;
    }
  
    // minorClassification 구성
    const minorClassification = checkedNodes.map(nodeId => {
      // node-115401 형태에서 ID만 추출
      const id = nodeId.replace('node-', '');
      
      // 해당 ID를 가진 chapter 찾기
      const chapterData = chapterList.find(chapter => {
        return chapter.largeChapterId?.toString() === id ||
               chapter.mediumChapterId?.toString() === id ||
               chapter.smallChapterId?.toString() === id ||
               chapter.topicChapterId?.toString() === id;
      });
  
      if (!chapterData) return null;
  
      // ID 길이에 따라 다른 객체 반환
      const classification = {
        subject: parseInt(chapterData.subjectId),
        large: parseInt(chapterData.largeChapterId)
      };
  
      // medium이 있는 경우에만 추가
      if (chapterData.mediumChapterId) {
        classification.medium = parseInt(chapterData.mediumChapterId);
      }
      
      // small이 있는 경우에만 추가
      if (chapterData.smallChapterId) {
        classification.small = parseInt(chapterData.smallChapterId);
      }
      
      // topic이 있는 경우에만 추가
      if (chapterData.topicChapterId) {
        classification.topic = parseInt(chapterData.topicChapterId);
      }
  
      return classification;
    }).filter(item => item !== null);
  
    // questionForm 구성
    let questionForm = '';
    if (selectedQuestiontype === 'objective') {
      questionForm = 'multiple';
    } else if (selectedQuestiontype === 'subjective') {
      questionForm = 'subjective';
    } else if (selectedQuestiontype.includes('objective') && selectedQuestiontype.includes('subjective')) {
      questionForm = 'multiple,subjective';
    }
  
    // API 요청 데이터 구성
    const requestData = {
      minorClassification,
      levelCnt: [
        parseInt(difficultyCounts.step1),
        parseInt(difficultyCounts.step2),
        parseInt(difficultyCounts.step3),
        parseInt(difficultyCounts.step4),
        parseInt(difficultyCounts.step5)
      ],
      questionForm,
      activityCategoryList: selectedEvaluation.map(item => 
        typeof item === 'object' ? parseInt(item.domainId) : parseInt(item)
      )
    };
  
    console.log('Request data:', requestData);
  
    // API 호출
    axios.post('https://bsherpa.duckdns.org/questions/external/chapters', requestData)
      .then((response) => {
        console.log('API Response:', response.data);
        const currentSubmitData = {
          range,
          selectedSteps,
          selectedEvaluation,
          selectedQuestiontype,
          source,
          bookId,
          checkedNodes,
          difficultyCounts,
          apiResponse: response.data
        };
        
        moveToStepWithData('step2', currentSubmitData);
      })
      .catch((error) => {
        console.error('API Error:', error);
        console.error('Error details:', error.response?.data);
        alert('요청 처리 중 오류가 발생했습니다.');
      });
  };



  
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
                        className={`btn-line ${selectedQuestiontype === 'objective' ? 'active' : ''}`}
                        onClick={() => handleQuestionTypeClick('objective')}
                      >
                        객관식
                      </button>
                      <button
                        type='button'
                        className={`btn-line ${selectedQuestiontype === 'subjective' ? 'active' : ''}`}
                        onClick={() => handleQuestionTypeClick('subjective')}
                      >
                        주관식
                      </button>
                    </div>
                  </div>

                  {/* 난이도 구성 */}
                  <DifficultyDisplay
                    difficultyCounts={difficultyCounts}
                    onCountsChange={handleDifficultyCountsChange}
                  />

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
                onClick={submitToStep2}
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

