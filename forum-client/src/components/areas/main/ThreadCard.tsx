import React, { FC } from "react";
import Thread from "../../../models/Thread";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { Link, useHistory } from "react-router-dom";
import { faEye, faHeart, faReplyAll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Main.css";

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard: FC<ThreadCardProps> = ({ thread }) => {
  const history = useHistory();
  const { width } = useWindowDimensions();

  const onClickShowThread = (e: React.MouseEvent<HTMLDivElement>) => {
    history.push(`/thread/${thread.id}`);
  };

  const getPoints = (thread: Thread) => {
    if (width <= 768) {
      return (
        <label style={{ marginRight: ".75em", marginTop: ".25em" }}>
          {thread.points || 0}
          <FontAwesomeIcon
            className="points-icon"
            icon={faHeart}
            style={{ marginLeft: ".2em" }}
          />
        </label>
      );
    }
    return null;
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

  const getPointsNonMobile = () => {
    if (width > 768) {
      return (
        <div className="threadcard-points">
          <div className="thread-points-item">
            {thread.points || 0}
            <br />
            <FontAwesomeIcon className="points-icon" icon={faHeart} />
          </div>
          <div className="thread-points-item" style={{ marginBottom: ".75em" }}>
            {thread && thread.threadItems && thread.threadItems.length}
            <br />
            <FontAwesomeIcon className="points-icon" icon={faReplyAll} />
          </div>
        </div>
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
            {thread.userName}
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
            <div>{thread.body}</div>
          </div>
          <div className="threadcard-footer">
            <span style={{ marginRight: ".5em" }}>
              <label>
                {thread.views}
                <FontAwesomeIcon className="icon-lg" icon={faEye} />
              </label>
            </span>
            <span>
              {getPoints(thread)}
              {getResponses(thread)}
            </span>
          </div>
        </div>
      </div>
      {getPointsNonMobile()}
    </section>
  );
};

export default ThreadCard;
