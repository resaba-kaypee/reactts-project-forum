import React, { useEffect } from "react";
import { Route, Switch } from "react-router";
import { useDispatch } from "react-redux";
import { UserProfileSetType } from "./store/user/Reducer";
import { gql, useQuery } from "@apollo/client";
import { ThreadCategoriesType } from "./store/categories/Reducer";
import "./App.css";
import Home from "./components/routes/Home";
import Thread from "./components/routes/thread/Thread";
import UserProfile from "./components/routes/userProfile/UserProfile";

const GetAllCategories = gql`
  query getAllCategories {
    getAllCategories {
      id
      userName
    }
  }
`;

function App() {
  const { data: categoriesData } = useQuery(GetAllCategories);
  // TODOS useRefreshReduxMe
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: UserProfileSetType,
      payload: {
        id: 1,
        userName: "testUser",
      },
    });

    if (categoriesData && categoriesData.getAllCategories) {
      dispatch({
        type: ThreadCategoriesType,
        payload: categoriesData.getAllCategories,
      });
    }
  }, [dispatch, categoriesData]);

  const renderHome = (props: any) => <Home {...props} />;
  const renderThread = (props: any) => <Thread {...props} />;
  const renderUserProfile = (props: any) => <UserProfile {...props} />;
  return (
    <Switch>
      <Route exact={true} path="/" render={renderHome} />
      <Route path="/categorythreads/:categoryId" render={renderHome} />
      <Route path="/thread/:id" render={renderThread} />
      <Route path="/userprofile/:id" render={renderUserProfile} />
    </Switch>
  );
}

export default App;
