import React from "react";
import Typography from "@mui/material/Typography";
import { useTheme } from "@emotion/react";
import NotFound from "../images/NotFound";

const NotFoundPage = () => {
  const theme = useTheme();
  return (
    <div className="container">
      <div className="content-block">
        <NotFound
          color={theme.palette.secondary.main}
          style={{ maxWidth: "50%" }}
        />
        <Typography variant="h4">Page Not Found</Typography>
      </div>
    </div>
  );
};

export default NotFoundPage;
