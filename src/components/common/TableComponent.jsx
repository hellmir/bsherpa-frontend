import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import {useDispatch} from "react-redux";
import {addExamId} from "../../slices/examIdSlice.jsx";

const handleAction = (action, id) => {
  console.log(`${action} clicked for ID: ${id}`);
  // 각 액션에 대한 로직 추가
};

const columns = [
  { field: 'id', headerName: '선택', width: 90 },
  {
    field: 'examName',
    headerName: '시험지명',
    width: 500,
    editable: true,
  },
  {
    field: 'examCount',
    headerName: '문항수',
    width: 150,
    editable: true,
  },
  {
    field: 'preView',
    headerName: '미리보기',
    width: 110,
    renderCell: (params) => <SearchIcon />,
  },
  {
    field: 'download',
    headerName: '다운로드',
    sortable: false,
    width: 400,
    renderCell: (params) => (
        <div>
          <Button
              onClick={() => handleAction('download', params.row.id)}
              variant="outlined"
              color="primary"
          >
            전체
          </Button>
          <Button
              onClick={() => handleAction('edit', params.row.id)}
              variant="outlined"
              color="secondary"
          >
            문제
          </Button>
          <Button
              onClick={() => handleAction('delete', params.row.id)}
              variant="outlined"
              color="error"
          >
            정답+해설
          </Button>
          <Button
              onClick={() => handleAction('view', params.row.id)}
              variant="outlined"
              color="default"
          >
            문항정보표
          </Button>
        </div>
    ),
  },
];

export default function TableComponent({ data }) {
  const [examIdList, setExamIdList] = useState([]);
  const dispatch = useDispatch()

  const rows = data.map((item, index) => (
      { id: index + 1, examName: item.examName, examCount: item.itemCnt, examId: item.examId }
  ));

  const handleRowSelection = (selectionModel) => {
    if (selectionModel.length > 0) {
      const selectedRow = selectionModel.map((item) =>
          rows.find(row => row.id === item)
      );

      console.log('Selected Row:', selectedRow);

      // examIdList 업데이트
      const newExamIds = selectedRow.map(row => row.examId); // 선택한 examId 배열 생성
      console.log(newExamIds) // 새로운 examId 배열로 업데이트
      dispatch(addExamId(newExamIds))
    }
  };

  return (
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={handleRowSelection}
        />
        <div>
          <h3>선택한 Exam ID 목록:</h3>
          <ul>
            {examIdList.map((id, index) => (
                <li key={index}>{id}</li>
            ))}
          </ul>
        </div>
      </Box>
  );
}
