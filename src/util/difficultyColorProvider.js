export const getDifficultyColor = (difficultyName) => {
    switch (difficultyName) {
        case "최상":
            return "red";
        case "상":
            return "orange";
        case "중":
            return "green";
        case "하":
            return "purple";
        case "최하":
            return "black";
        default:
            return "gray";
    }
}