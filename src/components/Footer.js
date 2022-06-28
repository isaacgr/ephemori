import React from "react";
import Link from "@mui/material/Link";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="content-block content-block--flex footer-content">
        <Link href="/" underline="none">
          Home
        </Link>
        <Link href="/about" underline="none">
          About
        </Link>
        <Link href="/contact" underline="none">
          Contact
        </Link>
        <Link href="/privacy-policy" underline="none">
          Privacy Policy
        </Link>
        <Link href="/terms-and-conditions" underline="none">
          Terms and Conditions
        </Link>
        <Link href="/cookie-policy" underline="none">
          Cookie Policy
        </Link>
      </div>
      <div className="copyright content-block">
        &copy; {new Date().getFullYear()} Copyright. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
