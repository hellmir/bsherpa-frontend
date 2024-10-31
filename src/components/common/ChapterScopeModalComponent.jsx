import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const groupChapters = (chapters) => {
    const grouped = [];

    chapters.forEach((chapter) => {
        const {largeChapterName, mediumChapterName, smallChapterName, topicChapterName} = chapter;

        let largeChapter = grouped.find(group => group.largeChapterName === largeChapterName);
        if (!largeChapter) {
            largeChapter = {
                largeChapterName,
                mediumChapters: [],
            };
            grouped.push(largeChapter);
        }

        let mediumChapter = largeChapter.mediumChapters.find(
            group => group.mediumChapterName === mediumChapterName
        );
        if (!mediumChapter) {
            mediumChapter = {
                mediumChapterName,
                smallChapters: [],
            };
            largeChapter.mediumChapters.push(mediumChapter);
        }

        let smallChapter = mediumChapter.smallChapters.find(
            group => group.smallChapterName === smallChapterName
        );
        if (!smallChapter) {
            smallChapter = {
                smallChapterName,
                topics: [],
            };
            mediumChapter.smallChapters.push(smallChapter);
        }

        if (!smallChapter.topics.includes(topicChapterName)) {
            smallChapter.topics.push(topicChapterName);
        }
    });

    return grouped;
};

const ChapterScopeModalComponent = ({open, onClose, chapters, subjectName, author, curriculumYear}) => {
    const groupedChapters = groupChapters(chapters);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="chapter-scope-title"
            aria-describedby="chapter-scope-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    maxHeight: 500,
                    overflowY: "auto",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        bgcolor: "#1976d2",
                        color: "white",
                        px: 2,
                        py: 1,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }}
                >
                    <Typography variant="subtitle1">
                        {subjectName}{author}({curriculumYear})
                    </Typography>
                    <IconButton color="inherit" onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                </Box>
                <Box sx={{p: 3}}>
                    <Typography id="chapter-scope-title" variant="h6" component="h2">
                        출제 범위
                    </Typography>
                    <div id="chapter-scope-description" style={{marginTop: "10px"}}>
                        {groupedChapters.map((largeChapter, largeIndex) => (
                            <div key={`large-${largeIndex}`}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {largeChapter.largeChapterName}
                                </Typography>
                                {largeChapter.mediumChapters.map((mediumChapter, mediumIndex) => (
                                    <div key={`medium-${mediumIndex}`} style={{marginLeft: "15px"}}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {mediumChapter.mediumChapterName}
                                        </Typography>
                                        {mediumChapter.smallChapters.map((smallChapter, smallIndex) => (
                                            <div key={`small-${smallIndex}`} style={{marginLeft: "30px"}}>
                                                <Typography variant="body2">
                                                    {smallChapter.smallChapterName}
                                                </Typography>
                                                {smallChapter.topics.map((topic, topicIndex) => (
                                                    <Typography
                                                        key={`topic-${topicIndex}`}
                                                        variant="body2"
                                                        style={{marginLeft: "45px"}}
                                                    >
                                                        {topic}
                                                    </Typography>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </Box>
            </Box>
        </Modal>
    );
};

export default ChapterScopeModalComponent;
