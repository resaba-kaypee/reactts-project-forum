import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { ThreadPointsBarProps } from "./ThreadPointsBar";

const ThreadPointsInline: FC<ThreadPointsBarProps> = ({
  points,
  responseCount,
}) => {
  return (
    <>
      <label style={{ marginRight: ".75em", marginTop: ".25em" }}>
        {points || 0}
        <FontAwesomeIcon
          className="points-icon"
          icon={faHeart}
          style={{ marginLeft: ".2em" }}
        />
      </label>
    </>
  );
};

export default ThreadPointsInline;
