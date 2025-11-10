import React from "react";
import { useNavigate } from "react-router-dom";
import "./Stages.css"; // optional for styling

const Stages = () => {
  const navigate = useNavigate();

  // Stages 1 to 6
  const stages = [1, 2, 3, 4, 5, 6];

  const handleStageClick = (stage) => {
    // Navigate to quiz page with stage number
    navigate(`/quiz/${stage}`);
  };

  return (
    <div className="stages-container">
      <h2 className="stages-title">Select a Stage</h2>
      <div className="stages-grid">
        {stages.map((stage) => (
          <div
            key={stage}
            className="stage-box"
            onClick={() => handleStageClick(stage)}
          >
            Stage {stage}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stages;
