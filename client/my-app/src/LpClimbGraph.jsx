import React from "react";
import { useEffect, useState } from "react";
import './CSS-folder/LpClimbGraph.css'
import {Bar, Line} from 'react-chartjs-2'
import {Chart as chartJS} from 'chart.js/auto'

const LpClimbGraph = ({chartData}) => {
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
        // position: 'top' as const,
      },
      title: {
        display: false,
        // text: 'Chart.js Bar Chart',
      },
    },
  };

  return (
    <Line options={options} data={chartData}></Line>
  )
};

export default LpClimbGraph;






