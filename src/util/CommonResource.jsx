import {useEffect} from "react";

const CommonResource = () => {
    useEffect(() => {
        // 공통 CSS
        const commonLink = document.createElement("link");
        commonLink.href = "https://ddipddipddip.s3.ap-northeast-2.amazonaws.com/css/common.css";
        commonLink.rel = "stylesheet";
        document.head.appendChild(commonLink);

        // 폰트 CSS
        const fontLink = document.createElement("link");
        fontLink.href = "https://ddipddipddip.s3.ap-northeast-2.amazonaws.com/tsherpa-css/font.css";
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);

        // 리셋 CSS
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

    return null;
};

export default CommonResource;
