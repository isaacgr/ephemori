import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { green } from "@mui/material/colors";

export default ({ buttonText, loading }) => {
  return (
    <Box sx={{ m: 1, position: "relative" }}>
      <Button variant="contained" disabled={loading} type="submit">
        {buttonText}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px"
          }}
        />
      )}
    </Box>
  );
};
