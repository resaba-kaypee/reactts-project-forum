import React, { FC, useEffect, useState } from "react";
import ThreadItem from "../../../models/ThreadItem";
import ThreadResponse from "./ThreadResponse";

interface ThreadResponseBuilderProps {
  threadItems?: Array<ThreadItem>;
  readOnly: boolean;
  refreshThread: () => void;
}
const ThreadResponseBuilder: FC<ThreadResponseBuilderProps> = ({
  threadItems,
  readOnly,
  refreshThread,
}) => {
  const [responseElements, setResponseElements] = useState<
    JSX.Element | undefined
  >();

  useEffect(() => {
    if (threadItems) {
      const thResponses = threadItems.map((ti) => {
        return (
          <li key={`thr-${ti.id}`}>
            <ThreadResponse
              body={ti.body}
              userName={ti.user.userName}
              lastModifiedOn={ti.createdOn}
              points={ti.points}
              readOnly={readOnly}
              threadItemId={ti?.id || "0"}
              refreshThread={refreshThread}
            />
          </li>
        );
      });
      setResponseElements(<ul>{thResponses}</ul>);
    }
    // eslint-disable-next-line
  }, [threadItems, readOnly]);
  return (
    <div className="thread-body-container">
      <strong style={{ marginBottom: ".75em" }}>Responses</strong>
      {threadItems?.length === 0 ? <p>No reply to this topic yet.</p> : null}
      {responseElements}
    </div>
  );
};

export default ThreadResponseBuilder;
