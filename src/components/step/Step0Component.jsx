import {useParams} from "react-router-dom";
import AccordionComponent from "../common/AccordionComponent.jsx";

function Step0Component() {
  const {bookId} = useParams()
  return (
      <div>
        bookId:{bookId}
        <AccordionComponent/>
      </div>
  );
}

export default Step0Component;