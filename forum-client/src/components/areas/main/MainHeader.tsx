import React, { FC } from "react";
import "./Main.css";
import Category from "../../../models/Category";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import CategoryDropDown from "../../CategoryDropDown";

interface MainHeaderProps {
  category?: Category;
}

const MainHeader: FC<MainHeaderProps> = ({ category }) => {
  const { width } = useWindowDimensions();

  const getLabelElement = () => {
    if (width <= 768) {
      return (
        <CategoryDropDown navigate={true} preselectedCategory={category} />
      );
    } else {
      return <strong>{category?.name || "Placeholder"}</strong>;
    }
  };
  return (
    <div className="main-header">
      <div
        className="title-bar"
        style={{ marginBottom: ".25em", paddingBottom: "0" }}>
        {getLabelElement()}
      </div>
    </div>
  );
};

export default MainHeader;
