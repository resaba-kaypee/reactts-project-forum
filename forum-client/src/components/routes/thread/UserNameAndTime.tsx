import React, { FC } from "react";
import { getTimePassIfLessThanDay } from "../../../common/dates";

interface UserNameAndTimeProps {
  userName?: string;
  lastModifiedOn?: Date;
}

const UserNameAndTime: FC<UserNameAndTimeProps> = ({
  userName,
  lastModifiedOn,
}) => {
  return (
    <span>
      <strong>{userName}</strong>
      <label style={{ marginLeft: "1em" }}>
        {lastModifiedOn ? getTimePassIfLessThanDay(lastModifiedOn) : ""}
      </label>
    </span>
  );
};

export default UserNameAndTime;
