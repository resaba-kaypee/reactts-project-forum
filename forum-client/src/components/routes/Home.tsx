import React, { FC } from "react";
import Nav from "../areas/Nav";
import Main from "../areas/main/Main";
import RightMenu from "../areas/rightmenu/RightMenu";
import "./Home.css";

const Home: FC = () => {
  return (
    <div className="screen-root-container home-container">
      <div className="navigation">
        <Nav />
      </div>
      <Main />
      <RightMenu />
    </div>
  );
};

export default Home;
