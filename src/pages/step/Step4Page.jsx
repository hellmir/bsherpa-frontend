import {useRef} from "react";
import Step4Component
    from "../../components/step/Step4Component.jsx";

const Step4Page =  () => {
    const pdfRef = useRef();
    console.log(pdfRef)
    return (
        <div>
            <h1>시험지 보관함</h1>
            <Step4Component/>
        </div>
    )
}
export default Step4Page;