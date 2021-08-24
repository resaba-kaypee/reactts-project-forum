import React, { useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setThreadItemsAction } from "../../../store/items/Reducers";
import "./Thread.css";
import Nav from "../../areas/Nav";
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

const Thread = () => {
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (id && id > 0) {
      execGetThreadById({
        variables: {
          id,
        },
      });
    }
  }, [id, execGetThreadById]);

  useEffect(() => {
    if (threadData && threadData.getThreadById) {
      setThread(threadData.getThreadById);
      dispatch(setThreadItemsAction(threadData.getThreadById.threadItems));
      setReadOnly(true);
    } else {
      setThread(undefined);
      setReadOnly(false);
    }
    // eslint-disable-next-line
  }, [threadData]);

  return (
    <div className="screen-root-container">
      <div className="thread-nav-container">
        <Nav />
      </div>
      <ThreadContent readOnly={readOnly} thread={thread} />
      {thread ? (
        <div className="thread-content-response-container">
          <hr className="thread-section-divider" />
          <ThreadResponseBuilder threadId={thread?.id} readOnly={readOnly} />
        </div>
      ) : null}
      {thread ? (
        <div className="thread-content-response-container">
          <hr className="thread-section-divider" />
          <div style={{ marginBottom: ".5em" }}>
            <strong>Reply to this topic</strong>
          </div>
          <ThreadPostResponse body={""} readOnly={false} threadId={thread.id} />
        </div>
      ) : null}
    </div>
  );
};

export default Thread;
