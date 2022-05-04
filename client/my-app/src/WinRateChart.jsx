import React from "react";
import {useState, useEffect} from "react"
import {Bar} from 'react-chartjs-2'
import {Chart as chartJS} from 'chart.js/auto'

const WinRateChart = () => {
  const [chartData, setChartData] = useState({
    // labels: FakeData.map((data)=>data.year),
    // datasets: [{
    //   label: "Users Gained",
    //   data: FakeData.map((data)=>data.userGain)
      labels: ['Top', 'Jungle', 'Mid', 'Bot', 'Support'],
      datasets: [{
          // label:'Role Assignment',
          data: [0.512, 0.534, 0.505, 0.548, 0.537],
          backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 2
      }]
  })

  const options = {
    responsive: true,
    scales:{
      yAxes: [
        {
          ticks: {
            beginAtZero: false,
          },
        },
      ],
    },
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
    <Bar
      options={options} 
      data={chartData}
    ></Bar>
  );
}

export default WinRateChart;