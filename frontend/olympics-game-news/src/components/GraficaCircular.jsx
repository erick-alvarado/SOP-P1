import React from "react";
import { Pie } from "react-chartjs-2";

const GraficaCircular = (props) => {
  const data = {
    labels: props.label,
    datasets: [
      {
        label: "My First Dataset",
        data: props.data,
        backgroundColor: props.color,
        hoverOffset: 4,
      },
    ],
  };

  const config = {
    type: "pie",
    data: data,
  };

  return (
    <div>
      <Pie data={data} config={config} />
    </div>
  );
};

export default GraficaCircular;
