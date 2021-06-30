import { useEffect, useState } from "react";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const GetAllCategories = gql`
  query getAllCategories {
    getAllCategories {
      id
      name
    }
  }
`;

const Categories = () => {
  const { loading, error, data } = useQuery(GetAllCategories);
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState<JSX.Element>(
    <div>Left Menu</div>
  );

  useEffect(() => {
    if (loading) {
      setCategories(<span>Loading ...</span>);
    } else if (error) {
      setCategories(<span>Error occurred loading categories ...</span>);
    } else {
      if (data && data.getAllCategories) {
        const cats = data.getAllCategories.map((cat: any) => {
          return (
            <li key={cat.id}>
              <Link
                to={`/categorythreads/${cat.id}`}
                style={{ textDecoration: "underline", color: "inherit" }}>
                {cat.name}
              </Link>
            </li>
          );
        });

        setCategories(<ul className="categories-list">{cats}</ul>);
      }
    }
    // eslint-disable-next-line
  }, [data]);

  if (width <= 768) return null;

  return <div className="categories">{categories}</div>;
};

export default Categories;
