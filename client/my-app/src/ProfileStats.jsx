import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import RoleAssignmentChart from "./RoleAssignmentChart";
import WinRateChart from "./WinRateChart";
import './CSS-folder/ProfileStats.css'
import Tyler1pic from './pictures/Tyler1-profile-pic.png'
import axios from "axios";

const ProfileStats = () => {

  const [stats, setStats] = useState()
  //grab data from server
  const getData = ()=>{
    axios.get("https://localhost3000/").then((response)=>{
      console.log(response)
      setStats(response)
    })
  }

  return (
    <div className="ProfileStats-box">
      <div className="section1">
        <div className="section1-1">Tyler1</div>
        <br></br>
        <img classname="profilePic" src={Tyler1pic} width="250" height="250"></img>
        <div className="section1-2">2,500LP to Challenger</div>
        <br></br>
        <div className="section1-3">Diamond 3</div>
        <div className="section1-4">73 LP</div>
        <div className="section1-5">51.2% (654W 620L)</div>
      </div>
      
      <div className="section2">
        <div className="section2-1">Games Played</div>
        <div className="section2-2">1,289</div>
        <br></br>

        <div className="section2-3">Time Spent in Games</div>
        <div className="section2-4">13 Days & 22 Hours</div>
        <br></br>

        <div className="section2-5">KDA*</div>
        <div className="section2-6">2.18</div>
        <div className="section2-7">(2,299 / 1,173 / 3,401)</div>
        <br></br>

        <div className="section2-8">Unique Champions Played*</div>
        <div className="section2-9">26</div>
        <br></br>
        
        <div className="section2-10">Penta Kill</div>
        <div className="section2-11">12</div>
        <br></br>

        <div className="section2-12">Longest Win Streak</div>
        <div className="section2-13">15</div>
        <br></br>

        <div className="section2-14">Longest Loss Streak</div>
        <div className="section2-15">19</div>
        <br></br>

      </div>
      
      <div className="section3">
        <div className="section3-1">
          <RoleAssignmentChart></RoleAssignmentChart>
        </div>
        <div className="section3-2">
          <WinRateChart></WinRateChart>
        </div>
      </div>

      <div className="section-footnotes">
        <div className="section-footnotes1">KDA* excludes 28 deaths from execution</div>
        <div className="section-footnotes2">Unique Champions Played*: champions with 10 or more ranked games</div>
      </div>
    </div>
  )
};

export default ProfileStats;
