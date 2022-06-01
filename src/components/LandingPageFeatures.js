import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LandscapeIcon from "@mui/icons-material/Landscape";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterCenterFocusIcon from "@mui/icons-material/FilterCenterFocus";
import { useTheme } from "@mui/material";
import { alpha } from "@mui/material";

const LandingPageFeatures = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{ marginTop: "3rem" }}
      className="content-block content-block--flex"
    >
      <Box sx={{ maxWidth: "20rem", flex: "1 1 0" }}>
        <LandscapeIcon
          sx={{
            border: "1px solid rgba(255,255,255,.5)",
            boxSizing: "initial",
            padding: "1rem",
            backgroundColor: alpha(theme.palette.primary.light, 0.5),
            color: theme.palette.primary.dark
          }}
          fontSize="large"
        />
        <Typography
          sx={{
            paddingTop: "1rem"
          }}
          variant="subtitle2"
        >
          Gain Perspective
        </Typography>
        <Typography variant="body2">
          Single page view provides you with a unique
          <br />
          perspective on your journey through life so far
        </Typography>
      </Box>
      <Box sx={{ maxWidth: "20rem", flex: "1 1 0" }}>
        <CalendarMonthIcon
          sx={{
            border: "1px solid rgba(255,255,255,.5)",
            boxSizing: "initial",
            padding: "1rem",
            backgroundColor: alpha(theme.palette.primary.light, 0.5),
            color: theme.palette.primary.dark
          }}
          fontSize="large"
        />
        <Typography
          sx={{
            paddingTop: "1rem"
          }}
          variant="subtitle2"
        >
          Visualize Experiences
        </Typography>
        <Typography variant="body2">
          Identify significant events which help
          <br />
          provide a reference point for reflection
        </Typography>
      </Box>
      <Box sx={{ maxWidth: "20rem", flex: "1 1 0" }}>
        <FilterCenterFocusIcon
          sx={{
            border: "1px solid rgba(255,255,255,.5)",
            boxSizing: "initial",
            padding: "1rem",
            backgroundColor: alpha(theme.palette.primary.light, 0.5),
            color: theme.palette.primary.dark
          }}
          fontSize="large"
        />
        <Typography
          sx={{
            paddingTop: "1rem"
          }}
          variant="subtitle2"
        >
          Focus
        </Typography>
        <Typography variant="body2">
          Use ephemori to provide some introspection
          <br />
          and get back to focusing on what is meaningful
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPageFeatures;
