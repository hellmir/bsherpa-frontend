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

  console.log(data)

  useEffect(() => {
    setSubject({ name: selectSubjectName });
  }, [selectSubjectName, refresh]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Something went wrong!</Typography>;

  const filteredBooks = data && data.data ? data.data.filter(book => book.subjectName === subject.name) : [];
  const groupedBooks = Array.from({ length: Math.ceil(filteredBooks.length / 4) }, (_, i) =>
      filteredBooks.slice(i * 4, i * 4 + 4)
  );

  return (
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <MainSelectComponent subjectName={subject.name} />

        <Box sx={{ marginBottom: 2, marginTop: 2 }}>
          <Typography variant="h6">{subject.name} 관련 도서</Typography>
          {groupedBooks.length > 0 ? (
              groupedBooks.map((group, index) => (
                  <Box sx={{ display: 'flex', gap: 2, marginBottom: 2, marginTop: 2 }} key={`box-${index}`}>
                    {group.map(book => (
                        <CardComponent
                            key={book.subjectId}
                            bookName={book.bookName}
                            bookId={book.subjectId}
                            author={book.author}
                        />
                    ))}
                  </Box>
              ))
          ) : (
              <Typography variant="body1">{subject.name} 관련 도서가 없습니다.</Typography>
          )}
        </Box>
      </Box>
  );
}

export default MainComponent;
