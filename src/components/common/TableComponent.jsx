import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch, useSelector} from "react-redux";
import {addExamId} from "../../slices/examIdSlice.jsx";
import {useEffect, useState} from "react";
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
        width: 400,
        renderCell: (params) => (
            <div>
                <ButtonGroup variant="contained">
                    <Step4ComponentQuestion examId={params.row.examId} />
                    <Step4ComponentAnswer examId={params.row.examId} />
                    <Step4ComponentAll examId={params.row.examId} />
                </ButtonGroup>
            </div>
        ),
    },
];

export default function TableComponent({ data, isUserExamSelected }) {
    const dispatch = useDispatch();
    const [selectionModel, setSelectionModel] = useState([]);
    const examIdList = useSelector(state => state.examIdSlice);

    useEffect(() => {
        console.log("Selection model updated:", selectionModel);
    }, [selectionModel]);

    const rows = data.map((item, index) => ({
        id: index + 1,
        examName: item.examName,
        examCount: item.itemCnt,
        examId: item.examId
    }));
    console.log("rows: ",rows)

    const handleSelection = (newSelectionModel) => {
        console.log("New Selection Model: ", newSelectionModel);
        setSelectionModel(newSelectionModel);

        if (isUserExamSelected) {
            // 사용자가 만든 시험지를 이미 선택했다면, 추가로 선택 불가
            if (newSelectionModel.length > 1) {
                alert("사용자 만든 시험지는 한 번에 하나만 선택할 수 있습니다.");
                return; // 여러 개 선택을 방지
            }

            const selectedExamIds = newSelectionModel.map(itemId => {
                const selectedExam = rows.find(item => item.id === itemId);
                console.log("selectedExam: ", selectedExam); // 로그 찍어 확인
                return selectedExam ? selectedExam.examId : null;
            }).filter(examId => examId !== null); // null 값은 필터링하여 제외


            console.log("Selected Exam IDs: ", selectedExamIds); // 최종 선택된 examId 확인
            if (selectedExamIds.length > 0) {
                dispatch(addExamId(selectedExamIds)); // examId 추가
            }
        } else {
            // Chapter 관련 시험지 선택 시, 사용자가 만든 시험지 선택을 막음
            const selectedItem = newSelectionModel.find(itemId => {
                const item = rows.find(row => row.id === itemId);
                return item && item.isUserExam; // 사용자가 만든 시험지를 확인
            });

            if (selectedItem) {
                alert("사용자 만든 시험지는 Chapter와 동시에 선택할 수 없습니다.");
                return; // Chapter와 사용자 시험지 동시에 선택 불가
            }

            const selectedChapterIds = [...new Set(newSelectionModel)] // 중복된 항목 제거
                .map(itemId => {
                    const selectedItem = rows.find(item => item.id === itemId);
                    console.log("selectedItem: ", selectedItem); // 로그 찍어 확인
                    return selectedItem ? selectedItem.examId : null;
                })
                .filter(examId => examId !== null); // null 값은 필터링하여 제외

            console.log("Selected Chapter IDs: ", selectedChapterIds); // 최종 선택된 examId 확인
            if (selectedChapterIds.length > 0) {
                dispatch(addExamId(selectedChapterIds)); // chapterId 추가
            }
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
                selectionModel={selectionModel}
                onRowSelectionModelChange={(newSelection) => handleSelection(newSelection)}
            />
        </Box>
    );
}
