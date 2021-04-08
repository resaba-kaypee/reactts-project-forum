import React, { useEffect } from "react";
import Home from "./components/routes/Home";
import { Route, Switch } from "react-router";
import { useDispatch } from "react-redux";
import Thread from "./components/routes/thread/Thread";
import "./App.css";
import { UserProfileSetType } from "./store/user/Reducer";
import UserProfile from "./components/routes/userProfile/UserProfile";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: UserProfileSetType,
      payload: {
        id: 1,
        userName: "testUser",
      },
    });
  }, [dispatch]);

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
