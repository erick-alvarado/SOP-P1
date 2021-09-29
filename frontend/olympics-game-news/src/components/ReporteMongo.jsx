import React from "react";
import GraficaCircular from "./GraficaCircular";

const ReporteMongo = () => {
  return (
    <div style={{ width: "400px", height: "400px" }}>
      <GraficaCircular
        label={["Red", "Blue", "Yellow", "Green", "Pink"]}
        data={[300, 50, 100, 87, 23]}
        color={[
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(25, 205, 86)",
          "rgb(255, 153, 255)",
        ]}
      />
    </div>
  );
};

export default ReporteMongo;
