import React from "react";
import { Bar } from "react-chartjs-2";

const Barra = (props) => {
  const data = {
    labels: props.label,
    datasets: [
      {
        label: "Upvotes",
        data: props.upvote,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Downvotes",
        data: props.downvote,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    // Elements options apply to all of the options unless overridden in a dataset
    // In this case, we are setting the border of each horizontal bar to be 2px wide
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div>
      <Bar options={options} data={data} />
    </div>
  );
};

export default Barra;
