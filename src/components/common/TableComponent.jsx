import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import SearchIcon from '@mui/icons-material/Search';

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
    type: 'number',
    width: 110,
    editable: true,
    renderCell:(params)=>(
        <SearchIcon/>
    )
  },
  {
    field: 'download',
    headerName: '다운로드',
    description: 'This column has a value getter and is not sortable.',
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

    )
  },
];


export default function TableComponent({data}) {
  console.log(data)
// eslint-disable-next-line react/prop-types
  const rows = data.map((item, index) => (
  { id: index+1, examName: item.examName, examCount: item.itemCnt }
))
;
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
        />
      </Box>
  );
}
