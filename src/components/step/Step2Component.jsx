import React, {useState} from "react";
import "../../assets/css/common.css"
import "../../assets/css/font.css"
import "../../assets/css/reset.css"

export default function Step2Component() {
    const [isProblemOptionsOpen, setIsProblemOptionsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("문제만 보기");

    const toggleProblemOptions = () => {
        setIsProblemOptionsOpen(!isProblemOptionsOpen);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setIsProblemOptionsOpen(false);
    };

    return (
        <>
            <div id="wrap" className="full-pop-que">
                <div className="full-pop-wrap">
                    <div className="pop-header">
                        <ul className="title">
                            <li>STEP 1 단원선택</li>
                            <li className="active">STEP 2 문항 편집</li>
                            <li>STEP 3 시험지 저장</li>
                        </ul>
                        <button type="button" className="del-btn"></button>
                    </div>
                    <div className="pop-content">
                        <div className="view-box">
                            <div className="view-top">
                                <div className="paper-info">
                                    <span>수학 1</span>
                                    이준열(2015)
                                </div>
                                <button className="btn-default btn-research"><i className="research"></i>재검색</button>
                                <button className="btn-default pop-btn" data-pop="que-scope-pop">출제범위</button>
                            </div>
                            <div className="view-bottom type01">
                                <div className="cnt-box">
                                    <div className="cnt-top">
                                        <span className="title">문제 목록</span>
                                        <div className="right-area">
                                            <div className="select-wrap">
                                                <button type="button" className="select-btn">문제만 보기</button>
                                                <ul className="select-list">
                                                    <li>
                                                        <a href="javascript:;">문제+정답 보기</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:;">문제+해설+정답 보기</a>
                                                    </li>
                                                    <li className="disabled">
                                                        <a href="javascript:;">편집단계에서만 적용되는 보기 옵션</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="select-wrap">
                                                <button
                                                    type="button"
                                                    className="select-btn"
                                                    onClick={toggleProblemOptions}
                                                >
                                                    {selectedOption}
                                                </button>

                                                {isProblemOptionsOpen && (
                                                    <ul className="select-list open">
                                                        <li>
                            <span onClick={() => handleOptionSelect("문제만 보기")}>
                              문제만 보기
                            </span>
                                                        </li>
                                                        <li>
                            <span onClick={() => handleOptionSelect("문제+정답 보기")}>
                              문제+정답 보기
                            </span>
                                                        </li>
                                                        <li>
                            <span
                                onClick={() => handleOptionSelect("문제+해설+정답 보기")}
                            >
                              문제+해설+정답 보기
                            </span>
                                                        </li>
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="view-que-list scroll-inner"
                                         style="display: -webkit-box;-webkit-box-orient:vertical">
                                        <div className="view-que-box">
                                            <div className="que-top">
                                                <div className="title">
                                                    <span className="num">1</span>
                                                    <div className="que-badge-group">
                                                        <span className="que-badge yellow">상</span>
                                                        <span className="que-badge gray">주관식</span>
                                                    </div>
                                                </div>
                                                <div className="btn-wrap">
                                                    <button type="button" className="btn-error pop-btn"
                                                            data-pop="error-report-pop"></button>
                                                    <button type="button" className="btn-delete"></button>
                                                </div>
                                            </div>
                                            <div className="view-que">
                                                <div className="que-content">
                                                    <p className="txt">5×5×13×13×13×13을 거듭제곱으로 나타낼 5의 지수를 a, 13의 거듭제곱의
                                                        밑을 b라
                                                        하자. 이때 b−a의 값을 구하시오.</p>
                                                </div>
                                                <div className="que-bottom">
                                                    <div className="data-area">
                                                        <div className="que-info">
                                                            <p className="answer"><span className="label">해설</span></p>
                                                            <div className="data-answer-area">
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt">해설 텍스트가 나오는 영역입니다.해설
																텍스트가
																나오는 영역입니다.해설 텍스트가 나오는 영역입니다.해설 텍스트가 나오는 영역입니다.</span>
                                                                </div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt">해설 텍스트가 나오는 영역입니다.해설
																텍스트가
																나오는 영역입니다.해설 텍스트가 나오는 영역입니다.해설 텍스트가 나오는 영역입니다.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="data-area type01">
                                                        <div className="que-info">
                                                            <p className="answer"><span
                                                                className="label type01">정답</span></p>
                                                            <div className="data-answer-area">
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                            </div>
                                                        </div>
                                                        <button type="button" className="btn-similar-que btn-default"><i
                                                            className="similar"></i> 유사 문제
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="que-info-last">
                                                <p className="chapter">자연수의 성질a소인수분해a거듭제곱a거듭제곱으로표현자연수의
                                                    성질a소인수분해a거듭제곱a거듭제곱으로표현</p>
                                            </div>
                                        </div>
                                        <div className="view-que-box active">
                                            <div className="que-top">
                                                <div className="title">
                                                    <span className="num">2</span>
                                                    <div className="que-badge-group">
                                                        <span className="que-badge green">중</span>
                                                        <span className="que-badge gray">객관식</span>
                                                    </div>
                                                </div>
                                                <div className="btn-wrap">
                                                    <button type="button" className="btn-error pop-btn"
                                                            data-pop="error-report-pop"></button>
                                                    <button type="button" className="btn-delete"></button>
                                                </div>
                                            </div>
                                            <div className="view-que">
                                                <div className="que-content">
                                                    <p className="txt">다음 중 3 : 4에 대해서 잘못 말한 것은 어느 것입니까?</p>
                                                    <ul>
                                                        <ol><em>①</em><span>3 대 4</span></ol>
                                                        <ol><em>②</em><span>3의 4에 대한 비</span></ol>
                                                        <ol><em>③</em><span>4에 대한 3의 비</span></ol>
                                                        <ol><em>④</em><span>3에 대한 4의 비</span></ol>
                                                        <ol><em>⑤</em><span>3과 4의 비</span></ol>
                                                    </ul>
                                                </div>
                                                <div className="que-bottom">
                                                    <div className="data-area">
                                                        <div className="que-info">
                                                            <p className="answer"><span className="label">해설</span></p>
                                                            <div className="data-answer-area">
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt">해설 텍스트가 나오는 영역입니다.해설
																텍스트가
																나오는 영역입니다.해설 텍스트가 나오는 영역입니다.해설 텍스트가 나오는 영역입니다.</span>
                                                                </div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt">해설 텍스트가 나오는 영역입니다.해설
																텍스트가
																나오는 영역입니다.해설 텍스트가 나오는 영역입니다.해설 텍스트가 나오는 영역입니다.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="data-area type01">
                                                        <div className="que-info">
                                                            <p className="answer"><span
                                                                className="label type01">정답</span></p>
                                                            <div className="data-answer-area">
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                            </div>
                                                        </div>
                                                        <button type="button" className="btn-similar-que btn-default"><i
                                                            className="similar"></i> 유사 문제
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="que-info-last">
                                                <p className="chapter">자연수의 성질a소인수분해a거듭제곱a거듭제곱으로표현</p>
                                            </div>
                                        </div>
                                        <div className="view-que-box">
                                            <div className="que-top">
                                                <div className="title">
                                                    <span className="num">3</span>
                                                    <div className="que-badge-group">
                                                        <span className="que-badge purple">하</span>
                                                        <span className="que-badge gray">주관식</span>
                                                    </div>
                                                </div>
                                                <div className="btn-wrap">
                                                    <button type="button" className="btn-error pop-btn"
                                                            data-pop="error-report-pop"></button>
                                                    <button type="button" className="btn-delete"></button>
                                                </div>
                                            </div>
                                            <div className="view-que">
                                                <div className="que-content">
                                                    <p className="txt">5×5×13×13×13×13을 거듭제곱으로 나타낼 5의 지수를 a, 13의 거듭제곱의
                                                        밑을 b라
                                                        하자. 이때 b−a의 값을 구하시오.
                                                        5×5×13×13×13×13을 거듭제곱으로 나타낼 5의 지수를 a, 13의 거듭제곱의 밑을 b라 하자. 이때
                                                        b−a의 값을 구하시오. 5×5×13×13×13×13을
                                                        거듭제곱으로
                                                        나타낼 5의 지수를 a, 13의 거듭제곱의 밑을 b라 하자. 이때 b−a의 값을 구하시오.</p>
                                                    <ul>
                                                        <ol><em>①</em><span>3의 4에 대한 비3의 4에 대한 비3의 4에 대한 비3의 4에 대한 비3의 4에 대한 비3의 4에 대한 비3의 4에 대한 비3의 4에
														대한
														비3의 4에 대한 비3의 4에 대한 비3의 4에 대한 비3의 4에 대한 비</span></ol>
                                                        <ol><em>②</em><span>3의 4에 대한 비</span></ol>
                                                        <ol><em>③</em><span>4에 대한 3의 비</span></ol>
                                                        <ol><em>④</em><span>3에 대한 4의 비</span></ol>
                                                        <ol><em>⑤</em><span>3과 4의 비</span></ol>
                                                    </ul>
                                                </div>
                                                <div className="que-bottom">
                                                    <button type="button" className="btn-similar-que btn-default"><i
                                                        className="similar"></i> 유사 문제
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="que-info-last">
                                                <p className="chapter">자연수의 성질a소인수분해a거듭제곱a거듭제곱으로표현</p>
                                            </div>
                                        </div>
                                        <div className="view-que-box">
                                            <div className="que-top">
                                                <div className="title">
                                                    <span className="num">4</span>
                                                    <div className="que-badge-group">
                                                        <span className="que-badge yellow">상</span>
                                                        <span className="que-badge gray">주관식</span>
                                                    </div>
                                                </div>
                                                <div className="btn-wrap">
                                                    <button type="button" className="btn-error pop-btn"
                                                            data-pop="error-report-pop"></button>
                                                    <button type="button" className="btn-delete"></button>
                                                </div>
                                            </div>
                                            <div className="view-que">
                                                <div className="que-content">
                                                    <p className="txt">5×5×13×13×13×13을 거듭제곱으로 나타낼 5의 지수를 a, 13의 거듭제곱의
                                                        밑을 b라
                                                        하자. 이때 b−a의 값을 구하시오.</p>
                                                </div>
                                                <div className="que-bottom">
                                                    <div className="data-area">
                                                        <div className="que-info">
                                                            <p className="answer"><span className="label">해설</span></p>
                                                            <div className="data-answer-area">
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt">해설 텍스트가 나오는 영역입니다.해설
																텍스트가
																나오는 영역입니다.해설 텍스트가 나오는 영역입니다.해설 텍스트가 나오는 영역입니다.</span>
                                                                </div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt">해설 텍스트가 나오는 영역입니다.해설
																텍스트가
																나오는 영역입니다.해설 텍스트가 나오는 영역입니다.해설 텍스트가 나오는 영역입니다.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="data-area type01">
                                                        <div className="que-info">
                                                            <p className="answer"><span
                                                                className="label type01">정답</span></p>
                                                            <div className="data-answer-area">
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                                <div className="paragraph"
                                                                     style="text-align: Justify"><span
                                                                    className="txt"> ①</span></div>
                                                            </div>
                                                        </div>
                                                        <button type="button" className="btn-similar-que btn-default"><i
                                                            className="similar"></i> 유사 문제
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="que-info-last">
                                                <p className="chapter">자연수의 성질a소인수분해a거듭제곱a거듭제곱으로표현</p>
                                            </div>
                                        </div>
                                        <div className="view-que-box">
                                            <div className="que-top">
                                                <div className="title">
                                                    <span className="num">5</span>
                                                    <div className="que-badge-group">
                                                        <span className="que-badge purple">하</span>
                                                        <span className="que-badge gray">주관식</span>
                                                    </div>
                                                </div>
                                                <div className="btn-wrap">
                                                    <button type="button" className="btn-error pop-btn"
                                                            data-pop="error-report-pop"></button>
                                                    <button type="button" className="btn-delete"></button>
                                                </div>
                                            </div>
                                            <div className="view-que">
                                                <div className="que-content">
                                                    <p className="txt">5×5×13×13×13×13을 거듭제곱으로 나타낼 5의 지수를 a, 13의 거듭제곱의
                                                        밑을 b라
                                                        하자. 이때 b−a의 값을 구하시오.</p>
                                                    <ul>
                                                        <ol><em>①</em><span>3 대 4</span></ol>
                                                        <ol><em>②</em><span>3의 4에 대한 비</span></ol>
                                                        <ol><em>③</em><span>4에 대한 3의 비</span></ol>
                                                        <ol><em>④</em><span>3에 대한 4의 비</span></ol>
                                                        <ol><em>⑤</em><span>3과 4의 비</span></ol>
                                                    </ul>
                                                </div>
                                                <div className="que-bottom">
                                                    <button type="button" className="btn-similar-que btn-default"><i
                                                        className="similar"></i> 유사 문제
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="que-info-last">
                                                <p className="chapter">자연수의 성질a소인수분해a거듭제곱a거듭제곱으로표현</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bottom-box">
                                        <div className="que-badge-group type01">
                                            <div className="que-badge-wrap">
                                                <span className="que-badge purple">하</span>
                                                <span className="num">5</span>
                                            </div>
                                            <div className="que-badge-wrap">
                                                <span className="que-badge green">중</span>
                                                <span className="num">15</span>
                                            </div>
                                            <div className="que-badge-wrap">
                                                <span className="que-badge yellow">상</span>
                                                <span className="num">25</span>
                                            </div>
                                        </div>
                                        <p className="total-num">총 <span>30</span>문제</p>
                                    </div>
                                </div>
                                <div className="cnt-box type01">
                                    <div className="tab-wrap">
                                        <ul className="tab-menu-type01">
                                            <li className="ui-tab-btn active">
                                                <a href="javascript:;">문제지 요약</a>
                                            </li>
                                            <li className="ui-tab-btn">
                                                <a href="javascript:;">유사 문제</a>
                                            </li>
                                            <li className="ui-tab-btn">
                                                <a href="javascript:;">삭제 문항</a>
                                            </li>
                                        </ul>
                                        <div className="contents on">
                                            <div className="table half-type no-passage">
                                                <div className="fix-head">
                                                    <span>이동</span>
                                                    <span>번호</span>
                                                    <span>시험지명</span>
                                                    <span>문제 형태</span>
                                                    <span>난이도</span>
                                                </div>
                                                <div className="tbody">
                                                    <div className="scroll-inner">
                                                        <div className="test ui-sortable" id="table-1">
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>1</span>
                                                                    <span className="tit">
																<div
                                                                    className="txt">자연수의 성질&gt;소인수분해&gt;거듭제곱&gt;거듭제곱으로표현</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">하</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>2</span>
                                                                    <span className="tit">
																<div
                                                                    className="txt">자연수의 성질&gt;소인수분해&gt;거듭제곱&gt;거듭제곱으로표현</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>객관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>3</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>4</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>객관식</span>
                                                                    <span>
																<span className="que-badge">하</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>5</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>6</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>7</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>객관식</span>
                                                                    <span>
																<span className="que-badge">상</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>8</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>9</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>객관식</span>
                                                                    <span>
																<span className="que-badge">상</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>10</span>
                                                                    <span className="tit">
																<div
                                                                    className="txt">자연수의 성질&gt;소인수분해&gt;거듭제곱&gt;거듭제곱으로표현</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">하</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>1</span>
                                                                    <span className="tit">
																<div
                                                                    className="txt">자연수의 성질&gt;소인수분해&gt;거듭제곱&gt;거듭제곱으로표현</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">하</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>2</span>
                                                                    <span className="tit">
																<div
                                                                    className="txt">자연수의 성질&gt;소인수분해&gt;거듭제곱&gt;거듭제곱으로표현</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>객관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>3</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>4</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>객관식</span>
                                                                    <span>
																<span className="que-badge">하</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>5</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>6</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>7</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>객관식</span>
                                                                    <span>
																<span className="que-badge">하</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>8</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">중</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>9</span>
                                                                    <span className="tit">
																<div className="txt">대단원&gt;중단원&gt;소단원&gt;토픽</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>객관식</span>
                                                                    <span>
																<span className="que-badge">상</span>
															</span>
                                                                </a>
                                                            </div>
                                                            <div className="col">
                                                                <a href="javascript:;">
															<span className="dragHandle ui-sortable-handle"><img
                                                                src="../images/common/ico_move_type01.png"
                                                                alt=""></img></span>
                                                                    <span>10</span>
                                                                    <span className="tit">
																<div
                                                                    className="txt">자연수의 성질&gt;소인수분해&gt;거듭제곱&gt;거듭제곱으로표현</div>
																<div className="tooltip-wrap">
																	<button type="button" className="btn-tip"></button>
																	<div className="tooltip type01">
																		<div className="tool-type01">
																			시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~시험지명블라블라~~</div>
																	</div>
																</div>
															</span>
                                                                    <span>주관식</span>
                                                                    <span>
																<span className="que-badge">하</span>
															</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bottom-box">
                                                <div className="que-badge-group">
                                                    <div className="que-badge-wrap">
                                                        <span className="que-badge gray">객관식</span>
                                                        <span className="num">35</span>
                                                    </div>
                                                    <div className="que-badge-wrap">
                                                        <span className="que-badge gray">주관식</span>
                                                        <span className="num">15</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="contents">
                                            탭 컨텐츠 (2)
                                        </div>
                                        <div className="contents">
                                            탭 컨텐츠 (3)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="step-btn-wrap">
                        <button type="button" className="btn-step">STEP 1 단원 선택</button>
                        <button type="button" className="btn-step next">STEP 3 시험지 저장</button>
                    </div>
                </div>
            </div>
        </>
    )
}
