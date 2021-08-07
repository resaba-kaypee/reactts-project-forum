import React, { FC, useEffect, useState, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Node } from "slate";
import { gql, useMutation } from "@apollo/client";
import { AppState } from "../../../store/AppState";
import { useSelector } from "react-redux";
import { getTextFromNodes } from "../../editor/RichEditor";
import Thread from "../../../models/Thread";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import ThreadBody from "./ThreadBody";
import ThreadCategory from "./ThreadCategory";
import ThreadHeader from "./ThreadHeader";
import ThreadTitle from "./ThreadTitle";
import Category from "../../../models/Category";

const CreateThread = gql`
  mutation createThread($categoryId: ID!, $title: String!, $body: String!) {
    createThread(categoryId: $categoryId, title: $title, body: $body) {
      messages
    }
  }
`;

const threadReducer = (state: any, action: any) => {
  switch (action.type) {
    case "userId":
      return { ...state, userId: action.payload };
    case "category":
      return { ...state, category: action.payload };
    case "title":
      return { ...state, title: action.payload };
    case "body":
      return { ...state, body: action.payload };
    case "bodyNode":
      return { ...state, bodyNode: action.payload };
    default:
      throw new Error("Unknown action type");
  }
};

interface ThreadContentProps {
  readOnly: boolean;
  thread?: Thread;
}

const ThreadContent: FC<ThreadContentProps> = ({ readOnly, thread }) => {
  const message = useSelector((state: AppState) => state.message);
  const user = useSelector((state: AppState) => state.user);
  const { id } = useParams<{ id: any }>();
  const [msg, setMsg] = useState<string>("");
  const [postMsg, setPostMsg] = useState("");
  const history = useHistory();

  const [execCreateThread] = useMutation(CreateThread);

  const [{ userId, category, title, bodyNode }, threadReducerDispatch] =
    useReducer(threadReducer, {
      userId: user ? user.id : "0",
      category: undefined,
      title: "",
      body: "",
      bodyNode: undefined,
    });

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
    let timeOut: any;
    if (msg) {
      timeOut = setTimeout(() => setMsg(""), 3000);
    }
    return () => clearTimeout(timeOut);
  }, [msg]);

  useEffect(() => {
    threadReducerDispatch({
      type: "userId",
      payload: user ? user.id : "0",
    });
  }, [user]);

  const receiveSelectedCategory = (cat: Category) => {
    threadReducerDispatch({
      type: "category",
      payload: cat,
    });
  };

  const receiveTitle = (updatedTitle: string) => {
    threadReducerDispatch({
      type: "title",
      payload: updatedTitle,
    });
  };

  const receiveBody = (body: Node[]) => {
    threadReducerDispatch({
      type: "bodyNode",
      payload: body,
    });
    threadReducerDispatch({
      type: "body",
      payload: getTextFromNodes(body),
    });
  };

  const onClickPost = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!userId || userId === "0") {
      setPostMsg("You must be logged in before you can post.");
    } else if (!category) {
      setPostMsg("Please select a category for your post.");
    } else if (!title) {
      setPostMsg("Please enter a title.");
    } else if (!bodyNode) {
      setPostMsg("Please enter a body.");
    } else {
      setPostMsg("");

      const newThread = {
        userId,
        categoryId: category?.id,
        title,
        body: JSON.stringify(bodyNode),
      };

      const { data: createThreadMsg } = await execCreateThread({
        variables: newThread,
      });

      if (
        createThreadMsg.createThread &&
        createThreadMsg.createThread.messages &&
        !isNaN(createThreadMsg.createThread.messages[0])
      ) {
        setPostMsg("Thread posted successfully.");
        history.push(`/thread/${createThreadMsg.createThread.messages[0]}`);
      } else {
        setPostMsg(createThreadMsg.createThread.messages[0]);
      }
    }
  };

  return (
    <div className="thread-content-container">
      <div className="thread-content-post-container">
        <ThreadHeader
          userName={thread ? thread?.user.userName : user?.userName}
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
            {postMsg ? (
              <div className="warning-container">
                <span className="warning">{postMsg}</span>
              </div>
            ) : null}
          </>
        )}
      </div>
      {msg ? (
        <div className="warning-container">
          <span className="warning">{msg}</span>
        </div>
      ) : null}
      {thread && id ? (
        <div className="thread-content-points-container">
          <ThreadPointsBar
            pointsFromThread={thread.points}
            threadId={thread?.id}
            responseCount={
              thread && thread.threadItems && thread.threadItems.length
            }
            allowUpdatedPoints={true}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ThreadContent;
