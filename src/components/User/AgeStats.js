import React from "react";
import { getDatesArray } from "../../util/dates";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const AgeStats = ({ dateOfBirth }) => {
  const dob = dateOfBirth ? new Date(dateOfBirth) : new Date();
  const age = getDatesArray(dob, new Date()).length;
  return (
    <Paper id="age-stats" variant="outlined">
      <Typography
        id="age"
        color="text.primary"
        variant="subtitle1"
        component="div"
        gutterBottom
      >
        {`${Math.floor(age / 7 / 52)} Years Old`}
      </Typography>
      <Typography
        id="time-lived"
        color="text.primary"
        variant="subtitle1"
        component="div"
        gutterBottom
      >
        {`Time Passed: ${Math.floor(age / 7)} Weeks / ${age} Days`}
      </Typography>
      <Typography
        id="time-left"
        color="text.primary"
        variant="subtitle1"
        component="div"
        gutterBottom
      >
        {`Time Remaining: ${Math.floor(80 * 52 - age / 7)} Weeks / ${
          80 * 52 * 7 - age
        } Days`}
      </Typography>
    </Paper>
  );
};

export default AgeStats;
