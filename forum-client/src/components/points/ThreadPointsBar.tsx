import React, { FC, useEffect } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faReplyAll,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { gql, useMutation } from "@apollo/client";

const UpdateThreadPoint = gql`
  mutation UpdateThreadPoint($threadId: ID!, $increment: Boolean!) {
    updateThreadPoint(threadId: $threadId, increment: $increment)
  }
`;
export class ThreadPointsBarProps {
  points: number = 0;
  responseCount?: number;
  userId?: string;
  threadId?: string;
  allowUpdatedPoints?: boolean = false;
  refreshThread?: () => void;
}

const ThreadPointsBar: FC<ThreadPointsBarProps> = ({
  points,
  responseCount,
  userId,
  threadId,
  allowUpdatedPoints,
  refreshThread,
}) => {
  const { width } = useWindowDimensions();

  const [execUpdateThreadPoint] = useMutation(UpdateThreadPoint);

  const onClickIncThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: true,
      },
    });

    refreshThread && refreshThread();
  };

  const onClickDecThreadPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    await execUpdateThreadPoint({
      variables: {
        threadId,
        increment: false,
      },
    });
    refreshThread && refreshThread();
  };

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
