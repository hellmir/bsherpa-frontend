import {useRef} from "react";
import Step4ComponentQuestion
    from "../../components/step/Step4ComponentQuestion.jsx";

const Step4Page =  () => {
    const pdfRef = useRef();
    console.log(pdfRef)
    return (
        <div>
            <h1>시험지 보관함</h1>
            <Step4ComponentQuestion/>
        </div>
    )
}
export default Step4Page;