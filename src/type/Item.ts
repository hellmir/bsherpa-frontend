export interface Item {
    itemId: number;
    passageId: string | number;
    passageUrl?: string;
    questionUrl?: string;
    answerUrl?: string;
    explainUrl?: string;
    difficultyName: string;
    questionFormCode: number;
    largeChapterName: string;
    mediumChapterName: string;
    smallChapterName: string;
    topicChapterName: string;
    itemNo: number;
    largeChapterId: number;
    mediumChapterId: number;
    smallChapterId: number;
    topicChapterId: number;
}
