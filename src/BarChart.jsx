import React from "react";
import { Bar,Doughnut,Pie } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend 
} from "chart.js";

// Register necessary components from Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const BarChart = ({totalIncome,totalExpense}) => {
  console.log('Total Income' , totalIncome);
  console.log('Total Expense' , totalExpense);
  const data = {
    labels: [
      'Income',
      'Expense',
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [totalIncome, totalExpense],
      backgroundColor: [
        'rgb(255, 205, 86)',
        'rgb(255, 99, 132)',
      ],
      hoverOffset: 4
    }]
  };

  return (
    <div style={{ width: "30%", margin: "auto" }}>
      <Pie data={data} />
    </div>
  );
};


export default React.forwardRef(BarChart);
