import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";

const ImportantDatesTable = ({
  importantDates,
  removeImportantDates,
  className
}) => {
  return (
    <TableContainer
      variant="outlined"
      id="legend"
      className={className}
      component={Paper}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right">Color</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Significance</TableCell>
            {removeImportantDates && (
              <TableCell align="right">Remove</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {importantDates.map((importantDate) => {
            return (
              <TableRow key={importantDate.id}>
                <TableCell
                  style={{
                    backgroundColor: importantDate.color
                  }}
                  align="right"
                ></TableCell>
                <TableCell align="right">{importantDate.date}</TableCell>
                <TableCell align="right">
                  {importantDate.significance}
                </TableCell>
                {removeImportantDates && (
                  <TableCell align="right">
                    <Button
                      onClick={async () =>
                        await removeImportantDates([importantDate.id])
                      }
                      variant="contained"
                      color="error"
                    >
                      <CancelIcon></CancelIcon>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ImportantDatesTable;
