import React, { useReducer, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userReducer from "../../auth/common/UserReducer";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import { gql, useMutation } from "@apollo/client";
import Nav from "../../areas/Nav";
import Thread from "../../../models/Thread";
import ThreadItem from "../../../models/ThreadItem";
import PasswordComparison from "../../auth/common/PasswordComparison";
import RichEditor from "../../editor/RichEditor";
import "./UserProfile.css";

const ChangePassword = gql`
  mutation ChangePassword($newPassword: String!) {
    changePassword(newPassword: $newPassword)
  }
`;

const UserProfile = () => {
  const [
    { userName, password, passwordConfirm, resultMsg, isSubmitDisabled },
    dispatch,
  ] = useReducer(userReducer, {
    userName: "",
    password: "*********",
    passwordConfirm: "*********",
    resultMsg: "",
    isSubmitDisabled: true,
  });

  const user = useSelector((state: AppState) => state.user);
  const [threads, setThreads] = useState<JSX.Element | undefined>();
  const [threadItems, setThreadItems] = useState<JSX.Element | undefined>();
  const [execChangePassword] = useMutation(ChangePassword);

  useEffect(() => {
    if (user) {
      dispatch({
        type: "userName",
        payload: user.userName,
      });

      const threadList = user.threads?.map((th: Thread) => {
        return (
          <li key={`user-th-${th.id}`}>
            <Link to={`/thread/${th.id}`} className="userprofile-link">
              {th.title}
            </Link>
          </li>
        );
      });

      setThreads(
        !user.threads || user.threads.length === 0 ? (
          <ul>
            <li>No created thread yet.</li>
          </ul>
        ) : (
          <ul>{threadList}</ul>
        )
      );

      const threadItemList = user.threadItems?.map((ti: ThreadItem) => (
        <li key={`user-th-${ti.id}`}>
          <div>
            <p>in response to thread id: {ti.thread.id}</p>
            <Link to={`/thread/${ti.thread?.id}`} className="userprofile-link">
              <RichEditor readOnly={true} existingBody={ti.body} />
            </Link>
          </div>
        </li>
      ));

      setThreadItems(
        !user.threadItems || user.threadItems.length === 0 ? (
          <p>No replies to a thread yet.</p>
        ) : (
          <ul>{threadItemList}</ul>
        )
      );
    } else {
      dispatch({
        type: "userName",
        payload: "",
      });
      setThreads(undefined);
      setThreadItems(undefined);
    }
    // eslint-disable-next-line
  }, [user]);

  const onClickChangePassword = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { data: changePasswordData } = await execChangePassword({
      variables: {
        newPassword: password,
      },
    });

    dispatch({
      type: "resultMsg",
      payload: changePasswordData ? changePasswordData.changePassword : "",
    });
  };

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
            <button
              className="action-btn"
              disabled={isSubmitDisabled}
              onClick={onClickChangePassword}>
              Change Password
            </button>
          </div>
        </div>
        {resultMsg && (
          <div className="warning-container">
            <span className="warning">{resultMsg}</span>
          </div>
        )}
        <div className="userprofile-postings">
          <hr className="thread-section-divider" />
          <div className="userprofile-threads">
            <strong>Thread Posted</strong>
            {threads}
          </div>
          <div className="userprofile-threads">
            <strong>Response Posted</strong>
            {threadItems}
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
