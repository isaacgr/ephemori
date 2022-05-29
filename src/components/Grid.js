import React from "react";
import { Paper } from "@mui/material";
import { useTheme } from "@mui/material";
import { getDatesArray, getGridWeek, weeksBetween } from "../util/dates";

const Grid = ({ dateOfBirth, importantDates }) => {
  const dob = dateOfBirth ? new Date(dateOfBirth) : new Date();
  const theme = useTheme();
  const datesArray = getDatesArray(dob, new Date());
  const numWeeks = Math.floor(datesArray.length / 7);

  const getTdColor = (gridWeek) => {
    if (importantDates.length !== 0) {
      for (const item in importantDates) {
        const date = importantDates[item].date;
        if (weeksBetween(dob, new Date(date)) + 1 === gridWeek) {
          return importantDates[item].color;
        }
      }
    }
  };

  return (
    <Paper className="grid-paper" elevation={4}>
      <table id="life-grid">
        <tbody>
          {[...Array(80).keys()].map((_, year) => {
            return (
              <tr key={year} id={year + 1}>
                {[...Array(52).keys()].map((_, week) => {
                  let currYear = year + 1;
                  let currWeek = week + 1;
                  const gridWeek = getGridWeek(currYear, currWeek);
                  return (
                    <td
                      key={gridWeek}
                      id={gridWeek}
                      style={{
                        backgroundColor:
                          getTdColor(gridWeek) ||
                          (gridWeek <= numWeeks &&
                            `${theme.palette.text.secondary}`),
                        borderColor: `${theme.palette.text.primary}`
                      }}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Paper>
  );
};

export default Grid;
