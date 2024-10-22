import {useParams} from "react-router-dom";

function Step0Component() {
  const {bookId} = useParams()
  return (
      <div>
        bookId:{bookId}
      </div>
  );
}

export default Step0Component;