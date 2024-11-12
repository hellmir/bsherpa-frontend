import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableComponent from "./TableComponent.jsx";

export default function AccordionComponent({ largeChapter, exams, onEditClick}) {
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    {largeChapter}
                </AccordionSummary>
                <AccordionDetails>
                    <TableComponent
                        data={exams}
                        onEditClick = {onEditClick}
                    />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}