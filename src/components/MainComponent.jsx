import { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MainSelectComponent from "./common/MainSelectComponent.jsx";
import Typography from "@mui/material/Typography";
import CardComponent from "./common/CardComponent.jsx";
import DrawerComponent from "./common/DrawerComponent.jsx";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBook } from "../api/mainApi.js";

const initState = {
  name: '국어'
}

function MainComponent() {
  const [subject, setSubject] = useState(initState);
  const { subjectName } = useParams();
  const { data } = useQuery({
    queryKey: ['subjectName', { subjectName }],
    queryFn: () => getBook(),
    staleTime: 1000
  });

  useEffect(() => {
    setSubject({ name: subjectName });
  }, [subjectName]);

  const filteredBooks = data ? data.data.filter(book => book.subjectName === subject.name) : [];

  // 5개씩 새로운 Box 태그를 생성하기 위해 그룹화
  const groupedBooks = Array.from({ length: Math.ceil(filteredBooks.length / 5) }, (_, i) =>
      filteredBooks.slice(i * 5, i * 5 + 5)
  );

  return (
      <>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
          <Toolbar />
          <MainSelectComponent subjectName={subjectName} />

          <Box sx={{ marginBottom: 2, marginTop: 2 }}>
            <Typography variant="h6">
              국어 관련 도서
            </Typography>
            {groupedBooks.length > 0 ? (
                groupedBooks.map((group, index) => (
                    <Box sx={{ display: 'flex', gap: 2 }} key={`box-${index}`}>
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
                <Typography variant="body1">국어 관련 도서가 없습니다.</Typography>
            )}
          </Box>

          <Box sx={{ marginBottom: 2, marginTop: 2 }}>
            <Typography variant="h6">
              추가 도서
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CardComponent />
              <CardComponent />
              <CardComponent />
              <CardComponent />
            </Box>
          </Box>

        </Box>
      </>
  );
}

export default MainComponent;
