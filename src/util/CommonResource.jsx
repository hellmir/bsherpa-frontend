import {useEffect} from "react";

const CommonResource = () => {
    useEffect(() => {
        // 공통 CSS
        const commonLink = document.createElement("link");
        commonLink.href = VITE_COMMON_LINK;
        commonLink.rel = "stylesheet";
        document.head.appendChild(commonLink);

        // 폰트 CSS
        const fontLink = document.createElement("link");
        fontLink.href = VITE_FONT_LINK;
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);

        // 리셋 CSS
        const resetLink = document.createElement("link");
        resetLink.href = VITE_RESET_LINK;
        resetLink.rel = "stylesheet";
        document.head.appendChild(resetLink);

        // 인풋 체크박스 이미지
        const inputCheckboxImage = document.createElement("link");
        inputCheckboxImage.href = INPUT_CHECKBOX_IMAGE;
        inputCheckboxImage.rel = "stylesheet";
        document.head.appendChild(inputCheckboxImage);

        // 셀렉트 애로우 이미지
        const selectArrowImage = document.createElement("link");
        selectArrowImage.href = SELECT_ARROW_IMAGE;
        selectArrowImage.rel = "stylesheet";
        document.head.appendChild(selectArrowImage);

        return () => {
            document.head.removeChild(commonLink);
            document.head.removeChild(fontLink);
            document.head.removeChild(resetLink);
            document.head.removeChild(inputCheckboxImage);
            document.head.removeChild(selectArrowImage);
        };
    }, []);

    return null;
};

export default CommonResource;