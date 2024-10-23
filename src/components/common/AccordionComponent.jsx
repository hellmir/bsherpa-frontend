import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {AccordionActions} from "@mui/material";
import Button from "@mui/material/Button";

export default function AccordionComponent() {
  return (
      <div>
        <Accordion>
          <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
          >
            1 단원
          </AccordionSummary>
          <AccordionDetails>
            단원 1 시험지
          </AccordionDetails>
          <AccordionActions>
            <Button>보기</Button>
            <Button>만들기</Button>
          </AccordionActions>
        </Accordion>


      </div>
  );
}
