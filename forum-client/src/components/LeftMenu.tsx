import { useEffect, useState } from "react";
import { getCategories } from "../services/DataService";
import Category from "../models/Category";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

const LeftMenu = () => {
  const { width } = useWindowDimensions();

  const [categories, setCategories] = useState<JSX.Element>(
    <div>Left Menu</div>
  );

  useEffect(() => {
    getCategories()
      .then((categoriesArr: Array<Category>) => {
        const cats = categoriesArr.map((category) => {
          return <li key={category.id}>{category.name}</li>;
        });

        setCategories(<ul className="category">{cats}</ul>);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  if (width <= 768) return null;

  return <div className="leftmenu">{categories}</div>;
};

export default LeftMenu;
