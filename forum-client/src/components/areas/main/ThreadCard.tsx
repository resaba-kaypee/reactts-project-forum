import React, { FC } from "react";
import Thread from "../../../models/Thread";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { Link, useHistory } from "react-router-dom";
import { faEye, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Main.css";
import ThreadPointsBar from "../../points/ThreadPointsBar";
import ThreadPointsInline from "../../points/ThreadPointsInline";
import RichEditor from "../../editor/RichEditor";

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: FC<ThreadCardProps> = ({ thread }) => {
  const history = useHistory();
  const { width } = useWindowDimensions();

  const onClickShowThread = (e: React.MouseEvent<HTMLDivElement>) => {
    history.push(`/thread/${thread.id}`);
  };

  const getResponses = (thread: Thread) => {
    if (width <= 768) {
      return (
        <label style={{ marginRight: ".5em" }}>
          {thread && thread.threadItems && thread.threadItems.length}
          <FontAwesomeIcon
            className="points-icon"
            icon={faReplyAll}
            style={{ marginLeft: ".25em", marginTop: "-.25em" }}
          />
        </label>
      );
    }
    return null;
  };

  return (
    <section className="panel threadcard-container">
      <div className="threadcard-txt-container">
        <div className="content-header">
          <Link
            className="link-txt"
            to={`/categorythreads/${thread.category.id}`}>
            <strong>{thread.category.name}</strong>
          </Link>
          <span className="username-header" style={{ marginLeft: ".5em" }}>
            {thread.user.userName}
          </span>
        </div>
        <div className="question">
          <div
            onClick={onClickShowThread}
            data-thread-id={thread.id}
            style={{ marginBottom: ".4em" }}>
            <strong>{thread.title}</strong>
          </div>
          <div
            className="threadcard-body"
            onClick={onClickShowThread}
            data-thread-id={thread.id}>
            <RichEditor existingBody={thread.body} readOnly={true} />
          </div>
          <div className="threadcard-footer">
            <span style={{ marginRight: ".5em" }}>
              <label>
                {thread.views}
                <FontAwesomeIcon className="icon-lg" icon={faEye} />
              </label>
            </span>
            {width <= 768 ? (
              <ThreadPointsInline points={thread?.points || 0} />
            ) : null}
            {getResponses(thread)}
          </div>
        </div>
      </div>
      <ThreadPointsBar
        points={thread?.points || 0}
        responseCount={
          thread && thread.threadItems && thread.threadItems.length
        }
      />
    </section>
  );
};

export default ThreadCard;
