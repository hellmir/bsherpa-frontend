import {Outlet} from "react-router-dom";

function StepIndexComponent() {
  return (
      <div>
        <div>스텝 인덱스 컴포넌트</div>
        <Outlet/>
      </div>
  );
}

export default StepIndexComponent;