import { gql, useMutation } from "@apollo/client";
import React, { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Node } from "slate";
import { AppState } from "../../../store/AppState";
import {
  createThreadItemAction,
  ThreadItemArray,
} from "../../../store/items/Reducers";
import RichEditor from "../../editor/RichEditor";

const CreateThreadItem = gql`
  mutation createThreadItem($threadId: ID!, $body: String!) {
    createThreadItem(threadId: $threadId, body: $body) {
      messages
    }
  }
`;

interface ThreadPostResponseProps {
  body?: string;
  threadId?: string;
  readOnly: boolean;
  refreshThread?: () => void;
}
const ThreadPostResponse: FC<ThreadPostResponseProps> = ({
  body,
  threadId,
  readOnly,
  refreshThread,
}) => {
  const user = useSelector((state: AppState) => state.user);
  const items: ThreadItemArray = useSelector((state: AppState) => state.items);
  const [execCreateThreadItem] = useMutation(CreateThreadItem);
  const dispatch = useDispatch();
  const [postMsg, setPostMsg] = useState("");
  const [bodyToSave, setBodyToSave] = useState("");

  useEffect(() => {
    if (body) {
      setBodyToSave(body || "");
    }
  }, [body]);

  const onClickPost = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (!user) {
      setPostMsg("Please login before adding a response.");
    } else if (!threadId) {
      setPostMsg("A parent thread must exist before a response can be posted.");
    } else if (!bodyToSave) {
      setPostMsg("Please enter some text.");
    } else {
      const { data } = await execCreateThreadItem({
        variables: {
          userId: user.id,
          threadId,
          body: bodyToSave,
        },
      });

      if (data && data.createThreadItem.__typename === "EntityResult") {
        dispatch(
          createThreadItemAction({
            id: String(items.threadItems.length + 1),
            body: bodyToSave,
            points: 0,
            user: {
              id: user.id,
              userName: user.userName,
            },
          })
        );
      }

      refreshThread && refreshThread();
    }
  };

  const receiveBody = (body: Node[]) => {
    const newBody = JSON.stringify(body);
    if (bodyToSave !== newBody) {
      setBodyToSave(newBody);
    }
  };

  return (
    <div style={{ marginBottom: "2em" }}>
      <div className="thread-content-post-response-container">
        <div></div>
        {!readOnly && threadId ? (
          <div style={{ marginTop: ".5em" }}>
            <button className="action-btn" onClick={onClickPost}>
              Post Response
            </button>
          </div>
        ) : null}
      </div>
      <div className="thread-body-editor">
        <RichEditor
          existingBody={bodyToSave}
          readOnly={readOnly}
          sendOutBody={receiveBody}
        />
      </div>
      {/* NOTES:  Error Message*/}
      <div className="warning-container">
        {postMsg && <span className="warning">{postMsg}</span>}
      </div>
    </div>
  );
};

export default ThreadPostResponse;
