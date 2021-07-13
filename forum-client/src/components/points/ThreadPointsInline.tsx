import { gql, useMutation } from "@apollo/client";
import {
  faChevronDown,
  faChevronUp,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import useUpdateThreadPoint from "../../hooks/useUpdateThreadPoint";

const UpdateThreadItemPoint = gql`
  mutation UpdateThreadItemPoint($threadItemId: ID!, $increment: Boolean!) {
    updateThreadItemPoint(threadItemId: $threadItemId, increment: $increment)
  }
`;

class ThreadPointsInlineProps {
  points: number = 0;
  threadId?: string;
  threadItemId?: string;
  allowUpdatePoints?: boolean = false;
  refreshThread?: () => void;
}

const ThreadPointsInline: FC<ThreadPointsInlineProps> = ({
  points,
  threadId,
  threadItemId,
  allowUpdatePoints,
  refreshThread,
}) => {
  const [execUpdateThreadItemPoint] = useMutation(UpdateThreadItemPoint);

  const { onClickDecThreadPoint, onClickIncThreadPoint } = useUpdateThreadPoint(
    refreshThread,
    threadId
  );

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
  };
  return (
    <div className="threadcard-footer">
      <span
        className="threadpointsinline-item-btn"
        style={{ display: `${allowUpdatePoints ? "block" : "none"}` }}>
        <FontAwesomeIcon
          icon={faChevronUp}
          className="icon-lg"
          onClick={threadId ? onClickIncThreadPoint : onClickIncThreadItemPoint}
        />
      </span>
      <span className="threadpointsinline-item-btn">{points}</span>
      <span
        className="threadpointsinline-item-btn"
        style={{ display: `${allowUpdatePoints ? "block" : "none"}` }}>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="icon-lg"
          onClick={threadId ? onClickDecThreadPoint : onClickDecThreadItemPoint}
        />
      </span>
      <span className="threadpointsinline-item-btn">
        <FontAwesomeIcon className="icon-lg" icon={faHeart} />
      </span>
    </div>
  );
};

export default ThreadPointsInline;
