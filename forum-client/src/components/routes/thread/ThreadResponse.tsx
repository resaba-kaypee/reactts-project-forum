import React, { FC } from "react";
import RichEditor from "../../editor/RichEditor";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import UserNameAndTime from "./UserNameAndTime";

interface ThreadResponseProps {
  body?: string;
  userName?: string;
  threadId?: string;
  threadItemId: string;
  points: number;
  lastModifiedOn?: Date;
  readOnly: boolean;
}
const ThreadResponse: FC<ThreadResponseProps> = ({
  body,
  userName,
  threadId,
  threadItemId,
  points,
  lastModifiedOn,
  readOnly,
}) => {
  return (
    <div>
      <div>
        <div>
          <UserNameAndTime
            userName={userName}
            lastModifiedOn={lastModifiedOn}
          />
          {threadItemId === "0" ? null : <span>#{threadItemId}</span>}
          {readOnly ? (
            <span style={{ display: "inline-block", marginLeft: "1em" }}>
              <ThreadPointsInline
                pointsFromThread={points}
                threadItemId={threadItemId}
                allowUpdatePoints={true}
              />
            </span>
          ) : null}
        </div>
      </div>
      <div className="thread-body-editor">
        <RichEditor existingBody={body} readOnly={readOnly} />
      </div>
    </div>
  );
};

export default ThreadResponse;
