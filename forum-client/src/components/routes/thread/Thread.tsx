import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Node } from "slate";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import Category from "../../../models/Category";
import ThreadModel from "../../../models/Thread";
import { AppState } from "../../../store/AppState";
import Nav from "../../areas/Nav";
import { getTextFromNodes } from "../../editor/RichEditor";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import "./Thread.css";
import ThreadBody from "./ThreadBody";
import ThreadCategory from "./ThreadCategory";
import ThreadHeader from "./ThreadHeader";
import ThreadPostResponse from "./ThreadPostResponse";
import ThreadResponseBuilder from "./ThreadResponseBuilder";
import ThreadTitle from "./ThreadTitle";

const GetThreadById = gql`
  query GetThreadById($id: ID!) {
    getThreadById(id: $id) {
      ... on EntityResult {
        messages
      }

      ... on Thread {
        id
        user {
          id
          userName
        }
        lastModifiedOn
        title
        body
        points
        category {
          id
          name
        }
        threadItems {
          id
          body
          points
          user {
            id
            userName
          }
        }
      }
    }
  }
`;

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

const Thread = () => {
  const { width } = useWindowDimensions();
  const [
    execGetThreadById,
    {
      // error: getThreadByIdErr,
      // called: getThreadByIdCalled,
      data: threadData,
    },
  ] = useLazyQuery(GetThreadById, { fetchPolicy: "no-cache" });
  const [execCreateThread] = useMutation(CreateThread);

  const [thread, setThread] = useState<ThreadModel | undefined>();
  const [readOnly, setReadOnly] = useState(false);
  const { id } = useParams<{ id: any }>();
  const user = useSelector((state: AppState) => state.user);
  const [{ userId, category, title, bodyNode }, threadReducerDispatch] =
    useReducer(threadReducer, {
      userId: user ? user.id : "0",
      category: undefined,
      title: "",
      body: "",
      bodyNode: undefined,
    });
  const [postMsg, setPostMsg] = useState("");
  const history = useHistory();

  const refreshThread = () => {
    console.log("refreshed");
    if (id && id > 0) {
      execGetThreadById({
        variables: {
          id,
        },
      });
    }
  };

  useEffect(() => {
    if (id && id > 0) {
      console.log("Thread id: ", id);
      execGetThreadById({
        variables: {
          id,
        },
      });
    }
  }, [id, execGetThreadById]);

  useEffect(() => {
    threadReducerDispatch({
      type: "userId",
      payload: user ? user.id : "0",
    });
  }, [user]);

  useEffect(() => {
    if (threadData && threadData.getThreadById) {
      setThread(threadData.getThreadById);
      setReadOnly(true);
    } else {
      setThread(undefined);
      setReadOnly(false);
    }
    // eslint-disable-next-line
  }, [threadData]);

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

    console.log("bodyNode: ", getTextFromNodes(bodyNode));
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
    <div className="screen-root-container">
      <div className="thread-nav-container">
        <Nav />
      </div>
      <div className="thread-content-container">
        <div className="thread-content-post-container">
          <ThreadHeader
            userName={thread ? thread.user.userName : user?.userName}
            lastModifiedOn={thread ? thread.lastModifiedOn : new Date()}
            title={thread ? thread.title : title}
          />
          {!id ? (
            <>
              <ThreadCategory
                category={thread ? thread.category : category}
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
          {/* Only on mobile */}
          {width <= 768 && thread ? (
            <ThreadPointsInline
              points={thread?.points || 0}
              threadId={thread?.id}
              refreshThread={refreshThread}
              allowUpdatePoints={true}
            />
          ) : null}
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
        {/* Desktop view */}
        <div className="thread-content-points-container">
          <ThreadPointsBar
            points={thread?.points || 0}
            responseCount={
              thread && thread.threadItems && thread.threadItems.length
            }
            threadId={thread?.id || "0"}
            allowUpdatedPoints={true}
            refreshThread={refreshThread}
          />
        </div>
      </div>
      {thread ? (
        <div className="thread-content-response-container">
          <hr className="thread-section-divider" />
          <ThreadResponseBuilder
            threadItems={thread?.threadItems}
            readOnly={readOnly}
            refreshThread={refreshThread}
          />
        </div>
      ) : null}
      {thread ? (
        <div className="thread-content-response-container">
          <hr className="thread-section-divider" />
          <div style={{ marginBottom: ".5em" }}>
            <strong>Reply to this topic</strong>
          </div>
          <ThreadPostResponse
            body={""}
            userName={user?.userName}
            lastModifiedOn={new Date()}
            points={0}
            readOnly={false}
            threadId={thread.id}
            threadItemId={"0"}
            refreshThread={refreshThread}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Thread;
