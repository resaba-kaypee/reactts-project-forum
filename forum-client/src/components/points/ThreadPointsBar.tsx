import React, { FC } from "react";
import useUpdateThreadPoint from "../../hooks/useUpdateThreadPoint";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faReplyAll,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

export class ThreadPointsBarProps {
  points: number = 0;
  responseCount?: number;
  threadId?: string;
  allowUpdatedPoints?: boolean = false;
  refreshThread?: () => void;
}

const ThreadPointsBar: FC<ThreadPointsBarProps> = ({
  points,
  responseCount,
  threadId,
  allowUpdatedPoints,
  refreshThread,
}) => {
  const { width } = useWindowDimensions();

  const { onClickIncThreadPoint, onClickDecThreadPoint } = useUpdateThreadPoint(
    refreshThread,
    threadId
  );

  if (width > 768) {
    return (
      <div className="threadcard-points">
        <div className="threadcard-points-item">
          <div
            className="threadcard-points-item-btn"
            style={{ display: `${allowUpdatedPoints ? "block" : "none"}` }}>
            <FontAwesomeIcon
              icon={faChevronUp}
              className="points-icon"
              onClick={onClickIncThreadPoint}
            />
          </div>
          {points}
          <div
            className="threadcard-points-item-btn"
            style={{ display: `${allowUpdatedPoints ? "block" : "none"}` }}>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="points-icon"
              onClick={onClickDecThreadPoint}
            />
          </div>
          <br />
          <FontAwesomeIcon className="points-icon" icon={faHeart} />
        </div>
        <div className="threadcard-points-item">
          {responseCount}
          <br />
          <FontAwesomeIcon className="points-icon" icon={faReplyAll} />
        </div>
      </div>
    );
  }
  return null;
};

export default ThreadPointsBar;
