import React, { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { gql, useLazyQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { UpdateThreadPointType } from "../../store/message/Reducer";
import useUpdateThreadPoint from "../../hooks/useUpdateThreadPoint";
import {
  faHeart,
  faReplyAll,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

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
  pointsFromThread?: number;
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
  const [updating, setUpdating] = useState<boolean>(true);
  const [points, setPoints] = useState(pointsFromThread);

  const [
    execGetThreadById,
    {
      // error: getThreadByIdErr,
      // called: getThreadByIdCalled,
      data: threadData,
    },
  ] = useLazyQuery(GetThreadById, { fetchPolicy: "no-cache" });

  const reduxDispatcher = useDispatch();

  const refreshThread = () => {
    execGetThreadById({
      variables: {
        threadId,
      },
    });
  };

  const updatingPoints = () => {
    setUpdating(true);
  };

  const { onClickIncThreadPoint, onClickDecThreadPoint, updatePointsMessage } =
    useUpdateThreadPoint(refreshThread, updatingPoints, threadId);

  useEffect(() => {
    if (updatePointsMessage && updatePointsMessage.updateThreadPoint !== "") {
      reduxDispatcher({
        type: UpdateThreadPointType,
        payload: updatePointsMessage.updateThreadPoint,
      });
    }
    // eslint-disable-next-line
  }, [updatePointsMessage]);

  useEffect(() => {
    if (threadId && updating) {
      execGetThreadById({
        variables: {
          threadId,
        },
      });
    }

    setUpdating(false);
  }, [threadId, execGetThreadById, updating]);

  useEffect(() => {
    if (threadData && threadData.getThreadById) {
      setPoints(threadData.getThreadById.points);
    }
  }, [threadData]);

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
        <div className="threadcard-points-item-heart">
          <FontAwesomeIcon className="points-icon" icon={faHeart} />
        </div>
      </div>
      <div className="threadcard-points-item">
        {responseCount}
        <br />
        <div className="threadcard-points-item-heart">
          <FontAwesomeIcon className="points-icon" icon={faReplyAll} />
        </div>
      </div>
    </div>
  );
};

export default ThreadPointsBar;
