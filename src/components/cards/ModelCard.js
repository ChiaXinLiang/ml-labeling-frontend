import React from "react";
import ActionButton from "../buttons/ActionButton";

export default function ModelCard({
  modelType,
  modelName,
  fScore,
  onTrain,
  onDeploy
}) {
  return (
    <div
      style={{
        backgroundColor: "white",
        width: "180px",
        height: "220px",
        borderRadius: "10px",
      }}
    >
      <p
        style={{
          height: "16px",
          display: "flex",
          marginLeft: "10%",
          fontSize: "18px",
          marginTop: "10px",
        }}
      >
        {modelName}
      </p>
      <p style={{ height: "10px", display: "flex", marginLeft: "10%" }}>
        F Score
      </p>
      <span
        style={{
          fontSize: "80px",
          color: "rgba(23, 115, 185, 0.77)",
          display: "flex",
          marginLeft: "10%",
          lineHeight: "80px",
        }}
      >
        {Number(fScore).toFixed(2)}
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <ActionButton
          onClick={onTrain}
          style={{
            width: "60px",
            height: "25px",
            backgroundColor: "rgba(11, 151, 34, 1)",
          }}
        >
          訓練
        </ActionButton>
        <ActionButton
          onClick={onDeploy}
          style={{
            width: "60px",
            height: "25px",
          }}
        >
          佈署
        </ActionButton>
      </div>
    </div>
  );
}
