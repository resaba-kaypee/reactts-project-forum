import React, { useState, useEffect } from "react";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { gql, useQuery } from "@apollo/client";
import TopCategory from "./TopCategory";
import groupBy from "lodash/groupBy";
import "./PopularPost.css";

const GetTopCategories = gql`
  query getTopCategories {
    getTopCategories {
      threadId
      categoryId
      categoryName
      title
    }
  }
`;

const PopularPost = () => {
  const { data: categoryThreadData } = useQuery(GetTopCategories);

  const { width } = useWindowDimensions();
  const [topCategories, setTopCategories] = useState<
    Array<JSX.Element> | undefined
  >();

  useEffect(() => {
    if (categoryThreadData && categoryThreadData.getTopCategories) {
      const topCatThreads = groupBy(
        categoryThreadData.getTopCategories,
        "categoryName"
      );

      const topElements = [];
      for (let key in topCatThreads) {
        const currentTop = topCatThreads[key];
        topElements.push(<TopCategory key={key} topCategories={currentTop} />);
      }
      setTopCategories(topElements);
    }
  }, [categoryThreadData]);

  if (width <= 768) return null;

  return (
    <div className="rightmenu rightmenu-container">
      <h2>Popular Posts</h2>
      {topCategories}
    </div>
  );
};

export default PopularPost;
