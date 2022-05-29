import React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export default () => {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
      <Typography variant="h5" component="div">
        Loading...
      </Typography>
    </Box>
  );
};
