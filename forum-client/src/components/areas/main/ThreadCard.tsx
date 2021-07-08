import React, { FC } from "react";
import {
  faEye,
  faHeart,
  faReplyAll,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useHistory } from "react-router-dom";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import Thread from "../../../models/Thread";
import RichEditor from "../../editor/RichEditor";
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

  const mobileInlinePoints = (thread: Thread) => {
    if (width <= 768) {
      return (
        <>
          {/* Total views */}
          <span style={{ marginRight: ".5em" }}>
            {thread.views}
            <FontAwesomeIcon className="icon-lg" icon={faEye} />
          </span>
          {/* Total upvotes/downvotes */}
          <span style={{ marginRight: ".5em" }}>
            {thread?.points || 0}
            <FontAwesomeIcon className="icon-lg" icon={faHeart} />
          </span>
          {/* Total response */}
          <span style={{ marginRight: ".5em" }}>
            {thread && thread.threadItems && thread.threadItems.length}
            <FontAwesomeIcon className="icon-lg" icon={faReplyAll} />
          </span>
        </>
      );
    }

    return (
      <>
        {/* Total views */}
        <span style={{ marginRight: ".5em" }}>
          {thread.views}
          <FontAwesomeIcon className="icon-lg" icon={faEye} />
        </span>
      </>
    );
  };

  return (
    <section className="threadcard-container">
      <div className="threadcard-txt-container">
        <div style={{ padding: "0.5em" }}>
          <Link
            className="link-txt"
            to={`/categorythreads/${thread.category.id}`}>
            <strong>{thread.category.name}</strong>
          </Link>
          <FontAwesomeIcon className="icon-lg" icon={faUser} />
          <span className="username-header" style={{ marginLeft: ".5em" }}>
            {thread.user.userName}
          </span>
        </div>
        <div>
          <div
            onClick={onClickShowThread}
            data-thread-id={thread.id}
            style={{ padding: "0.5em" }}>
            <strong>{thread.title}</strong>
          </div>
          <div
            className="threadcard-body"
            onClick={onClickShowThread}
            data-thread-id={thread.id}
            style={{ padding: "0.5em" }}>
            <RichEditor existingBody={thread.body} readOnly={true} />
          </div>
          <div className="threadcard-footer">{mobileInlinePoints(thread)}</div>
        </div>
      </div>
    </section>
  );
};

export default ThreadCard;
