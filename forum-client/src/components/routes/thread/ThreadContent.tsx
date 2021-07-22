import React, { FC } from "react";
import { Node } from "slate";
import Thread from "../../../models/Thread";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import ThreadBody from "./ThreadBody";
import ThreadCategory from "./ThreadCategory";
import ThreadHeader from "./ThreadHeader";
import ThreadTitle from "./ThreadTitle";
import Category from "../../../models/Category";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";

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
  refreshThread?: () => void;
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
  refreshThread,
  thread,
}) => {
  const { width } = useWindowDimensions();

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
          pointsFromThread={thread?.points || 0}
          threadId={thread?.id}
          responseCount={
            thread && thread.threadItems && thread.threadItems.length
          }
          allowUpdatedPoints={true}
        />
      </div>
    </div>
  );
};

export default ThreadContent;
