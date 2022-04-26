import React from "react";
import {useState, useEffect} from "react"
import LpClimbGraph from "./LpClimbGraph";
import ProfileStats from "./ProfileStats";
import './CSS-folder/Components.css'
import './CSS-folder/App.css'

const App = () => {
  return (
    <div className="App-box">
      <div className="Components-box">
        <ProfileStats></ProfileStats>
        <LpClimbGraph></LpClimbGraph>
      </div>
    </div>
  );
}

export default App;
