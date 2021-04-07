import React, { FC } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faReplyAll } from "@fortawesome/free-solid-svg-icons";

export interface ThreadPointsBarProps {
  points: number;
  responseCount?: number;
}

const ThreadPointsBar: FC<ThreadPointsBarProps> = ({
  points,
  responseCount,
}) => {
  const { width } = useWindowDimensions();

  if (width > 768) {
    return (
      <div className="threadcard-points">
        <div className="threadcard-points-item">
          {points}
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
