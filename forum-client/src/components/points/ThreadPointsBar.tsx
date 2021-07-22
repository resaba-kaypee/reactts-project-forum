import React, { FC, useEffect, useState } from "react";
import useUpdateThreadPoint from "../../hooks/useUpdateThreadPoint";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faReplyAll,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { gql, useLazyQuery } from "@apollo/client";

const GetThreadById = gql`
  query GetThreadById($threadId: ID!) {
    getThreadById(id: $threadId) {
      ... on EntityResult {
        messages
      }

      ... on Thread {
        id
        points
      }
    }
  }
`;

export class ThreadPointsBarProps {
  pointsFromThread: number = 0;
  responseCount?: number;
  threadId?: string;
  allowUpdatedPoints?: boolean = false;
  refreshThread?: () => void;
}

const ThreadPointsBar: FC<ThreadPointsBarProps> = ({
  pointsFromThread,
  responseCount,
  threadId,
  allowUpdatedPoints,
}) => {
  const { width } = useWindowDimensions();
  const [updating, setUpdating] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(pointsFromThread);
  console.log(points);

  const [
    execGetThreadById,
    {
      // error: getThreadByIdErr,
      // called: getThreadByIdCalled,
      data: threadData,
    },
  ] = useLazyQuery(GetThreadById, { fetchPolicy: "no-cache" });

  const refreshThread = () => {
    execGetThreadById({
      variables: {
        threadId,
      },
    });
  };

  const updatePoints = () => {
    setUpdating(true);
  };

  useEffect(() => {
    if (updating) {
      execGetThreadById({
        variables: {
          threadId,
        },
      });
    }

    setUpdating(false);
    // eslint-disable-next-line
  }, [updating, execGetThreadById]);

  useEffect(() => {
    if (threadData && threadData.getThreadById) {
      setPoints(threadData.getThreadById.points);
    }
  }, [threadData]);

  const { onClickIncThreadPoint, onClickDecThreadPoint } = useUpdateThreadPoint(
    refreshThread,
    updatePoints,
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
