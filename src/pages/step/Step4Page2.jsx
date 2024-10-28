function Step4Page2() {
    const data = {
        passageHtml: "<div>눈이 내린다...</div>",
        questionHtml: "<div>이 시에 대한 감상으로 알맞지 않은 것은?</div>",
        choice1Html: "<div>정윤: 이 시를 읽고 봄에 눈이 내리는 장면이 떠올랐어.</div>",
        choice2Html: "<div>마음: 시를 읽는 내내 포근하고 평화로운 느낌이 들었어.</div>",
        choice3Html: "<div>서현: 나는 봄눈을 바라보는 말하는 이의 쓸쓸한 처지에 공감이 갔어.</div>",
        choice4Html: "<div>현용: ‘봄눈’을 다른 사물에 빗대 표현하여 더욱 생생한 느낌이 들었어.</div>",
        choice5Html: "<div>정수: 소리는 같지만 뜻이 다른 글자인 ‘눈’으로 내용을 재미있게 표현하고 있어.</div>",
        answerHtml: "<div>정답: ③</div>",
        explainHtml: "<div>이 시에서는 봄눈이 주는 포근하고 부드러운 느낌을 바탕으로 따뜻하고 아름다운 봄날의 분위기를 느낄 수 있다.</div>"
    };

    return (
        <div>
            <div className="passage" dangerouslySetInnerHTML={{ __html: data.passageHtml }} />
            <div className="question" dangerouslySetInnerHTML={{ __html: data.questionHtml }} />
            <div className="choices">
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="choice" dangerouslySetInnerHTML={{ __html: data[`choice${i + 1}Html`] }} />
                ))}
            </div>
            <div className="answer" dangerouslySetInnerHTML={{ __html: data.answerHtml }} />
            <div className="explanation" dangerouslySetInnerHTML={{ __html: data.explainHtml }} />
        </div>
    );
}
export default Step4Page2