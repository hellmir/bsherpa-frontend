import { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MainSelectComponent from "./common/MainSelectComponent.jsx";
import Typography from "@mui/material/Typography";
import CardComponent from "./common/CardComponent.jsx";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBook } from "../api/mainApi.js";
import useCustomMove from "../hooks/useCustomMove.jsx";
import Grid from "@mui/material/Grid";

const initState = {
    name: '국어'
};

function MainComponent() {
    const [subject, setSubject] = useState(initState);
    const { refresh } = useCustomMove();
    const location = useLocation();
    const selectSubjectName = location.state?.data || initState.name;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['subjectName', { selectSubjectName, refresh }],
        queryFn: getBook,
        staleTime: 1000,
    });

    useEffect(() => {
        setSubject({ name: selectSubjectName });
    }, [selectSubjectName, refresh]);

    const filteredBooks = data && data.data ? data.data.filter(book => book.subjectName === subject.name) : [];

    return (
        <Box 
            component="main" 
            sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'background.default',
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                    display: 'none'
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
            }}
        >
            <Box sx={{ p: 4, minHeight: '100%' }}>
                <Toolbar />
                <Typography variant="h6" sx={{ marginBottom: 4 }}>
                    {subject.name} 관련 도서
                </Typography>

                <MainSelectComponent subjectName={subject.name} />

                {isLoading ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        minHeight: '200px'
                    }}>
                        <Typography>Loading...</Typography>
                    </Box>
                ) : isError ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        minHeight: '200px'
                    }}>
                        <Typography>Something went wrong!</Typography>
                    </Box>
                ) : filteredBooks.length > 0 ? (
                    <Box sx={{ marginY: 4 }}>
                        <Grid 
                            container 
                            spacing={4}
                            sx={{ 
                                maxWidth: 1200,  // 너비 감소
                                margin: '0 auto',
                                paddingX: 2
                            }}
                        >
                            {filteredBooks.map((book) => (
                                <Grid 
                                    item 
                                    xs={12} 
                                    sm={6} 
                                    md={4}  // 4에서 3으로 변경
                                    key={book.subjectId}
                                    sx={{ 
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <CardComponent
                                        bookName={book.bookName}
                                        bookId={book.subjectId}
                                        author={book.author}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        minHeight: '50vh'
                    }}>
                        <Typography variant="body1">
                            {subject.name} 관련 도서가 없습니다.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default MainComponent;
