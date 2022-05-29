import React, { useState } from "react";
import DatePicker from "../DatePicker";
import { getDateString } from "../../util/dates";
import { parseISO } from "date-fns";

const UserInfo = ({ dob, setUser }) => {
  const [startDate, setStartDate] = useState(dob || getDateString(new Date()));
  return (
    <div className="user-info">
      <div className="content-block">
        <DatePicker
          label="Birthday"
          value={parseISO(startDate)}
          onAccept={async (date) => {
            await setUser({
              user: {
                dateOfBirth: getDateString(date)
              }
            });
          }}
          onChange={(date) => {
            setStartDate(getDateString(date));
          }}
        />
      </div>
    </div>
  );
};

export default UserInfo;
