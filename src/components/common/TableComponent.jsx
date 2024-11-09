import React from "react";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from "react-redux";
import { addExamId } from "../../slices/examIdSlice.jsx";
import Button from "@mui/material/Button";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
export default function TableComponent({ data, onEditClick }) {
    const dispatch = useDispatch();
    const examIdList = useSelector(state => state.examIdSlice);

    const handleEditButtonClick = (examId) => {
        dispatch(addExamId([examId]));  // examId를 Redux에 추가

        // 최상위 컴포넌트로 examId를 전달
        if (onEditClick) {
            onEditClick(examId);
        }
    };

    const columns = [
        { field: 'id', headerName: '선택', width: 90 },
        {
            field: 'examName',
            headerName: '시험지명',
            width: 500,
            editable: false,
        },
        {
            field: 'examCount',
            headerName: '문항수',
            width: 150,
            editable: false,
        },
        {
            field: 'preView',
            headerName: '미리보기',
            width: 110,
            renderCell: () => <SearchIcon />,
        },
        {
            field: 'download',
            headerName: '편집하기',
            sortable: false,
            width: 400,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    onClick={() => handleEditButtonClick(params.row.examId)} // 클릭 시 호출
                    startIcon={<BorderColorOutlinedIcon />}
                >
                    편집하기
                </Button>
            ),
        },
    ];

    const rows = data.map((item, index) => ({
        id: index + 1,
        examName: item.examName,
        examCount: item.itemCnt,
        examId: item.examId,
    }));

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
                disableRowSelectionOnClick
                onRowSelectionModelChange={(selectionModel) => {
                    const selectedExamIds = selectionModel.map(
                        (selectedId) => rows.find((row) => row.id === selectedId)?.examId
                    );
                    dispatch(addExamId(selectedExamIds)); // 선택된 examIds를 Redux에 추가
                }}
            />
        </Box>
    );
}
