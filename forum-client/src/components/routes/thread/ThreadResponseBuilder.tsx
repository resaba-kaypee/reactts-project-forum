import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/AppState";
import { ThreadItemArray } from "../../../store/items/Reducers";
import ThreadItem from "../../../models/ThreadItem";
import ThreadResponse from "./ThreadResponse";

interface ThreadResponseBuilderProps {
  threadId?: string;
  readOnly: boolean;
}

const ThreadResponseBuilder: FC<ThreadResponseBuilderProps> = ({
  threadId,
  readOnly,
}) => {
  const [responseElements, setResponseElements] = useState<
    JSX.Element | undefined
  >();
  const items: ThreadItemArray = useSelector((state: AppState) => state.items);

  useEffect(() => {
    if (items.threadItems) {
      const thResponses = items.threadItems.map((ti: ThreadItem) => {
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
      });
      setResponseElements(
        items.threadItems.length > 0 ? (
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
  }, [items, readOnly]);

  return (
    <div className="thread-body-container">
      <strong style={{ marginBottom: ".75em" }}>Responses</strong>
      {responseElements}
    </div>
  );
};

export default ThreadResponseBuilder;
