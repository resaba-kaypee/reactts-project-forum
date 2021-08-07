import React, { FC, useEffect, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import ThreadItem from "../../../models/ThreadItem";
import ThreadResponse from "./ThreadResponse";

const GetThreadItemsByThreadId = gql`
  query getThreadItemsByThreadId($threadId: ID!) {
    getThreadItemsByThreadId(threadId: $threadId) {
      ... on EntityResult {
        messages
      }

      ... on ThreadItemArray {
        threadItems {
          id
          body
          points
          lastModifiedOn
          user {
            id
            userName
          }
        }
      }
    }
  }
`;

interface ThreadResponseBuilderProps {
  threadId?: string;
  readOnly: boolean;
}

const ThreadResponseBuilder: FC<ThreadResponseBuilderProps> = ({
  threadId,
  readOnly,
}) => {
  const [
    execGetThreadItemsByThreadId,
    {
      // called,
      // error,
      data: threadItemData,
    },
  ] = useLazyQuery(GetThreadItemsByThreadId, { fetchPolicy: "no-cache" });

  const [responseElements, setResponseElements] = useState<
    JSX.Element | undefined
  >();

  useEffect(() => {
    if (threadId) {
      execGetThreadItemsByThreadId({
        variables: { threadId },
      });
    }
  }, [threadId, execGetThreadItemsByThreadId]);

  useEffect(() => {
    if (
      threadItemData &&
      threadItemData.getThreadItemsByThreadId &&
      threadItemData.getThreadItemsByThreadId.threadItems
    ) {
      const thResponses =
        threadItemData.getThreadItemsByThreadId.threadItems.map(
          (ti: ThreadItem) => {
            return (
              <li key={`thr-${ti.id}`}>
                <ThreadResponse
                  body={ti.body}
                  userName={ti.user.userName}
                  lastModifiedOn={ti.createdOn}
                  points={ti.points}
                  readOnly={readOnly}
                  threadItemId={ti?.id || "0"}
                />
              </li>
            );
          }
        );
      setResponseElements(
        threadItemData.getThreadItemsByThreadId.threadItems.length > 0 ? (
          <ul>{thResponses}</ul>
        ) : (
          <ul>
            <li>
              <p>No reply to this topic yet.</p>
            </li>
          </ul>
        )
      );
    }
    // eslint-disable-next-line
  }, [threadItemData, readOnly]);

  return (
    <div className="thread-body-container">
      <strong style={{ marginBottom: ".75em" }}>Responses</strong>
      {responseElements}
    </div>
  );
};

export default ThreadResponseBuilder;
