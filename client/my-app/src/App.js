import React from "react";
import {useState, useEffect} from "react"
import axios, { Axios } from 'axios'
import LpClimbGraph from "./LpClimbGraph";
import ProfileStats from "./ProfileStats";
import './CSS-folder/App.css'
import {FakeData} from './FakeData'
import Header from "./Header";


const App = () => {




  const [fakeData, setFakeData] = useState({
    labels: FakeData.map((data)=>data.year),
    datasets: [{
      label: "Users Gained",
      data: FakeData.map((data)=>data.userGain)

      }]
  })
  return (
    <div className="App-box">
      <div className="Components-box">
        <Header></Header>
        <ProfileStats></ProfileStats>
        <div className="LpClimbGraph-box">
          <LpClimbGraph chartData={fakeData}></LpClimbGraph>
        </div>
      </div>

    </div>
  );
}

export default App;
