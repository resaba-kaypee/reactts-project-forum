import React, { useEffect, useReducer, useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { Node } from "slate";
import { AppState } from "../../../store/AppState";
import { getTextFromNodes } from "../../editor/RichEditor";
import "./Thread.css";
import Nav from "../../areas/Nav";
import Category from "../../../models/Category";
import ThreadModel from "../../../models/Thread";
import ThreadContent from "./ThreadContent";
import ThreadPostResponse from "./ThreadPostResponse";
import ThreadResponseBuilder from "./ThreadResponseBuilder";

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
  const [execCreateThread] = useMutation(CreateThread);
  const [
    execGetThreadById,
    {
      // error: getThreadByIdErr,
      // called: getThreadByIdCalled,
      data: threadData,
    },
  ] = useLazyQuery(GetThreadById, { fetchPolicy: "no-cache" });

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
    //   console.log("refreshed");
    //   // if (id && id > 0) {
    //   //   execGetThreadById({
    //   //     variables: {
    //   //       id,
    //   //     },
    //   //   });
    //   // }
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
      <ThreadContent
        id={id}
        onClickPost={onClickPost}
        postMsg={postMsg}
        readOnly={readOnly}
        receiveSelectedCategory={receiveSelectedCategory}
        receiveTitle={receiveTitle}
        receiveBody={receiveBody}
        thread={thread}
      />
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
