import React, { FC, useEffect, useState } from "react";
import { Node } from "slate";
import { AppState } from "../../../store/AppState";
import { useSelector } from "react-redux";
import Thread from "../../../models/Thread";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import ThreadBody from "./ThreadBody";
import ThreadCategory from "./ThreadCategory";
import ThreadHeader from "./ThreadHeader";
import ThreadTitle from "./ThreadTitle";
import Category from "../../../models/Category";

interface ThreadContentProps {
  id: string;
  onClickPost?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  postMsg: string;
  readOnly: boolean;
  receiveSelectedCategory: (cat: Category) => void;
  receiveTitle: (updatedTitle: string) => void;
  receiveBody: (body: Node[]) => void;
  thread?: Thread;
}

const ThreadContent: FC<ThreadContentProps> = ({
  id,
  onClickPost,
  postMsg,
  readOnly,
  receiveSelectedCategory,
  receiveTitle,
  receiveBody,
  thread,
}) => {
  const message = useSelector((state: AppState) => state.message);
  const user = useSelector((state: AppState) => state.user);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    if (message) {
      setMsg(message);
    }
  }, [message]);

  useEffect(() => {
    if (user && user.id !== "0") {
      setMsg("");
    }
  }, [user]);

  useEffect(() => {
    if (msg) {
      const timeOut = setTimeout(() => setMsg(""), 3000);

      return () => clearTimeout(timeOut);
    }
  }, [msg]);

  return (
    <div className="thread-content-container">
      <div className="thread-content-post-container">
        <ThreadHeader
          userName={thread && thread?.user.userName}
          lastModifiedOn={thread ? thread.lastModifiedOn : new Date()}
          title={thread && thread.title}
        />
        {!id ? (
          <>
            <ThreadCategory
              category={thread && thread.category}
              sendOutSelectedCategory={receiveSelectedCategory}
            />
            <ThreadTitle
              title={thread ? thread.title : ""}
              readOnly={thread ? readOnly : false}
              sendOutTitle={receiveTitle}
            />
          </>
        ) : null}
        <ThreadBody
          body={thread ? thread.body : ""}
          readOnly={thread ? readOnly : false}
          sendOutBody={receiveBody}
        />
        {/* Writing new topic */}
        {thread ? null : (
          <>
            <div style={{ marginTop: ".5em", marginBottom: ".5em" }}>
              <button className="action-btn" onClick={onClickPost}>
                Post
              </button>
            </div>
            <strong>{postMsg}</strong>
          </>
        )}
      </div>
      {msg ? (
        <div className="warning-container">
          <span className="warning">{msg}</span>
        </div>
      ) : null}
      <div className="thread-content-points-container">
        {thread ? (
          <ThreadPointsBar
            pointsFromThread={thread.points}
            threadId={thread?.id}
            responseCount={
              thread && thread.threadItems && thread.threadItems.length
            }
            allowUpdatedPoints={true}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ThreadContent;
