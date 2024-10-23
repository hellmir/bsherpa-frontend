import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableComponent from "./TableComponent.jsx";

export default function AccordionComponent({largeChapter, exams}) {
  return (
      <div>
        <Accordion>
          <AccordionSummary
              expandIcon={<ExpandMoreIcon/>}
              aria-controls="panel1-content"
              id="panel1-header"
          >
            {largeChapter}
          </AccordionSummary>

          {/* eslint-disable-next-line react/prop-types */}
          {/*{exams.map((item, index) => (*/}
              <>

                <AccordionDetails>
                  <TableComponent
                      data={exams}
                  />
                  {/*{item.examName}*/}
                </AccordionDetails>
                {/*<AccordionActions>
                  <Button>보기</Button>
                  <Button>만들기</Button>
                </AccordionActions>*/}
              </>



        </Accordion>
      </div>
  );
}
