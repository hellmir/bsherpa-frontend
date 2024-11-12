import Step3Component from "../../components/step/Step3Component.jsx";
import StepBackgroundComponent from "../../components/step/StepBackgroundComponent.jsx";
import React from "react";

function Step3Page() {
  return (
      <div>
          <StepBackgroundComponent>
            <Step3Component/>
          </StepBackgroundComponent>
      </div>
  );
}

export default Step3Page;