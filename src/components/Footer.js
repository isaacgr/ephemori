import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="content-block content-block--flex">
        <Box sx={{ maxWidth: "30rem", flex: "1 1 0" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Link href="#" underline="none">
              About
            </Link>
            <Link href="#" underline="none">
              Contact
            </Link>
            <Link href="#" underline="none">
              Privacy Policy
            </Link>
            <Link href="#" underline="none">
              Donate
            </Link>
          </Box>
        </Box>
      </div>
      <div className="copyright content-block">
        &copy; {new Date().getFullYear()} Copyright. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
