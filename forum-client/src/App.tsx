import React from "react";
import "./App.css";
import SideBar from "./components/SideBar";
import LeftMenu from "./components/LeftMenu";
import Main from "./components/Main";
import RightMenu from "./components/RightMenu";

function App() {
  return (
    <div className="App">
      <nav className="navigation">Nav</nav>
      <SideBar />
      <LeftMenu />
      <Main />
      <RightMenu />
    </div>
  );
}

export default App;
