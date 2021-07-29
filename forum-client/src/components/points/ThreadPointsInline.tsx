import React, { FC, useEffect, useState } from "react";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import {
  faChevronDown,
  faChevronUp,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UpdateThreadItemPoint = gql`
  mutation UpdateThreadItemPoint($threadItemId: ID!, $increment: Boolean!) {
    updateThreadItemPoint(threadItemId: $threadItemId, increment: $increment)
  }
`;

const GetThreadItemById = gql`
  query GetThreadItemById($threadItemId: ID!) {
    getThreadItemById(threadItemId: $threadItemId) {
      ... on EntityResult {
        messages
      }

      ... on ThreadItem {
        id
        points
        body
      }
    }
  }
`;

const UpdateThreadItemPoints = (
  updatingPoints: () => void,
  refreshThread: () => void,
  threadItemId?: string
) => {
  const [execUpdateThreadItemPoint] = useMutation(UpdateThreadItemPoint);

  const onClickIncThreadItemPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log("incremented");
    await execUpdateThreadItemPoint({
      variables: {
        threadItemId,
        increment: true,
      },
    });

    refreshThread && refreshThread();
    updatingPoints && updatingPoints();
  };

  const onClickDecThreadItemPoint = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();
    console.log("decremented");
    await execUpdateThreadItemPoint({
      variables: {
        threadItemId,
        increment: false,
      },
    });

    refreshThread && refreshThread();
    updatingPoints && updatingPoints();
  };

  return {
    onClickDecThreadItemPoint,
    onClickIncThreadItemPoint,
  };
};

class ThreadPointsInlineProps {
  pointsFromThread: number = 0;
  threadItemId?: string;
  allowUpdatePoints?: boolean = false;
  refreshThread?: () => void;
}

const ThreadPointsInline: FC<ThreadPointsInlineProps> = ({
  pointsFromThread,
  threadItemId,
  allowUpdatePoints,
}) => {
  const [execGetThreadItemById, { data: threadItemData }] = useLazyQuery(
    GetThreadItemById,
    { fetchPolicy: "no-cache" }
  );
  const [updating, setUpdating] = useState<boolean>(false);
  const [points, setPoints] = useState(pointsFromThread);

  const updatingPoints = () => {
    setUpdating(true);
  };

  const refreshThread = () => {
    execGetThreadItemById({
      variables: {
        threadItemId,
      },
    });
  };

  useEffect(() => {
    if (threadItemId && updating) {
      execGetThreadItemById({
        variables: {
          threadItemId,
        },
      });
    }
  }, [threadItemId, updating, execGetThreadItemById]);

  useEffect(() => {
    if (threadItemData && threadItemData.getThreadItemById) {
      console.log("called");
      console.log(threadItemData.getThreadItemById.points);
      setPoints(threadItemData.getThreadItemById.points);
    }
  }, [threadItemData]);

  const { onClickDecThreadItemPoint, onClickIncThreadItemPoint } =
    UpdateThreadItemPoints(updatingPoints, refreshThread, threadItemId);

  return (
    <div className="threadcard-footer">
      <span
        className="threadpointsinline-item-btn"
        style={{ display: `${allowUpdatePoints ? "block" : "none"}` }}>
        <FontAwesomeIcon
          icon={faChevronUp}
          className="icon-lg"
          onClick={onClickIncThreadItemPoint}
        />
      </span>
      <span className="threadpointsinline-item-btn">{points}</span>
      <span
        className="threadpointsinline-item-btn"
        style={{ display: `${allowUpdatePoints ? "block" : "none"}` }}>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="icon-lg"
          onClick={onClickDecThreadItemPoint}
        />
      </span>
      <span className="threadpointsinline-item-btn">
        <FontAwesomeIcon className="icon-lg" icon={faHeart} />
      </span>
    </div>
  );
};

export default ThreadPointsInline;
