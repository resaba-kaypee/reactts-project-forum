import React, { FC } from "react";
import RichEditor from "../../editor/RichEditor";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import UserNameAndTime from "./UserNameAndTime";

interface ThreadResponseProps {
  body?: string;
  userName?: string;
  userId: string;
  threadItemId: string;
  lastModifiedOn?: Date;
  points: number;
  readOnly: boolean;
  refreshThread?: () => void;
}
const ThreadResponse: FC<ThreadResponseProps> = ({
  body,
  userName,
  userId,
  threadItemId,
  lastModifiedOn,
  points,
  readOnly,
  refreshThread,
}) => {
  return (
    <div>
      <div>
        <UserNameAndTime userName={userName} lastModifiedOn={lastModifiedOn} />
        <span style={{ marginLeft: "1em" }}>
          <ThreadPointsInline
            points={points || 0}
            userId={userId}
            threadItemId={threadItemId}
            allowUpdatePoints={true}
            refreshThread={refreshThread}
          />
        </span>
      </div>
      <div className="thread-body-editor">
        <RichEditor existingBody={body} readOnly={readOnly} />
      </div>
    </div>
  );
};

export default ThreadResponse;
