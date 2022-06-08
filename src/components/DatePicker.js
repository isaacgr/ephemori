import React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default ({ value, label, onAccept, onChange, disableFuture }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        disableFuture={disableFuture}
        label={label}
        disableMaskedInput={true}
        mask="____-__-__"
        inputFormat="yyyy-MM-dd"
        views={["year", "month", "day"]}
        openTo="year"
        value={value}
        onAccept={onAccept}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};
