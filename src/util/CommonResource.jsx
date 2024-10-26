import {useEffect} from "react";

const CommonResource = () => {
    useEffect(() => {
        // 공통 CSS
        const commonLink = document.createElement("link");
        const VITE_COMMON_LINK = import.meta.env.VITE_COMMON_LINK
        commonLink.href = VITE_COMMON_LINK;
        commonLink.rel = "stylesheet";
        document.head.appendChild(commonLink);

        // 폰트 CSS
        const fontLink = document.createElement("link");
        const VITE_FONT_LINK = import.meta.env.VITE_FONT_LINK
        fontLink.href = VITE_FONT_LINK;
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);

        // 리셋 CSS
        const resetLink = document.createElement("link");
        const VITE_RESET_LINK = import.meta.env.VITE_RESET_LINK
        resetLink.href = VITE_RESET_LINK;
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
