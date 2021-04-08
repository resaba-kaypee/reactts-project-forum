import React, { useReducer, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userReducer from "../../auth/common/UserReducer";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import { getUserThreads } from "../../../services/DataService";
import Nav from "../../areas/Nav";
import Thread from "../../../models/Thread";
import ThreadItem from "../../../models/ThreadItem";
import PasswordComparison from "../../auth/common/PasswordComparison";
import "UserProfile.css";

const UserProfile = () => {
  const [
    { userName, password, passwordConfirm, resultMsg, isSubmitDisable },
    dispatch,
  ] = useReducer(userReducer, {
    userName: "",
    password: "*********",
    passwordConfirm: "*********",
    resultMsg: "",
    isSubmitDisable: true,
  });

  const user = useSelector((state: AppState) => state.user);
  const [threads, setThreads] = useState<JSX.Element | undefined>();
  const [threadItems, setThreadItems] = useState<JSX.Element | undefined>();

  useEffect(() => {
    console.log("user", user);
    if (user) {
      dispatch({
        type: "userName",
        payload: user.userName,
      });

      getUserThreads(user.id).then((items) => {
        const threadItemsInThreadList: Array<ThreadItem> = [];
        const threadList = items.map((th: Thread) => {
          for (let i = 0; i < th.threadItems.length; i++) {
            threadItemsInThreadList.push(th.threadItems[i]);
          }

          return (
            <li key={`user-th-${th.id}`}>
              <Link to={`/thread/${th.id}`} className="userprofile-link">
                {th.title}
              </Link>
            </li>
          );
        });
        setThreads(<ul>{threadList}</ul>);

        const threadItemList = threadItemsInThreadList.map((ti: ThreadItem) => (
          <li key={`user-th-${ti.threadId}`}>
            <Link to={`/thread/${ti.threadId}`} className="userprofile-link">
              {ti.body}
            </Link>
          </li>
        ));
        setThreadItems(<ul>{threadItemList}</ul>);
      });
    }
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="screen-root-container">
      <div className="thread-nav-container">
        <Nav />
      </div>
      <form className="userprofile-content-container">
        <div>
          <strong>User Profile</strong>
          <label style={{ marginLeft: ".75em" }}>{userName}</label>
        </div>
        <div className="userprofile-password">
          <div>
            <PasswordComparison
              dispatch={dispatch}
              password={password}
              passwordConfirm={passwordConfirm}
            />
            <button className="action-btn" disabled={isSubmitDisable}>
              Change Password
            </button>
          </div>
          <div style={{ marginTop: ".5em" }}>
            <label>{resultMsg}</label>
          </div>
        </div>
        <div className="userprofile-postings">
          <hr className="thread-section-divider" />
          <div className="userprofile-threads">
            <strong>Thread Posted</strong>
            {threads}
          </div>
          <div className="userprofile-threads">
            <strong>Thread Items Posted</strong>
            {threadItems}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;