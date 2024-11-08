import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch, useSelector} from "react-redux";
import {addExamId} from "../../slices/examIdSlice.jsx";
import ButtonGroup from "@mui/material/ButtonGroup";
import Step4ComponentQuestion from "../step/Step4ComponentQuestion.jsx";
import Step4ComponentAnswer from "../step/Step4ComponentAnswer.jsx";
import Step4ComponentAll from "../step/Step4ComponentAll.jsx";

const handleAction = (action, id) => {
    console.log(`${action} clicked for ID: ${id}`);
};

const columns = [
    {field: 'id', headerName: '선택', width: 90},
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
        renderCell: () => <SearchIcon/>,
    },
    {
        field: 'download',
        headerName: '다운로드',
        sortable: false,
        width: 400
    },
];

export default function TableComponent({data}) {
    const dispatch = useDispatch();
    const examIdList = useSelector(state => state.examIdSlice);

    const rows = data.map((item, index) => (
        {
            id: index + 1,
            examName: item.examName,
            examCount: item.itemCnt,
            examId: item.examId
        }
    ));

    const handleRowSelection = (selectionModel) => {
        if (selectionModel.length > 0) {
            const selectedRow = selectionModel.map((item) =>
                rows.find(row => row.id === item)
            );

            console.log('Selected Row:', selectedRow);

            const newExamIds = selectedRow.map(row => row.examId);
            console.log(newExamIds);

            dispatch(addExamId(newExamIds));
        }
    };

    return (
        <Box sx={{height: 400, width: '100%'}}>
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
        </Box>
    );
}
