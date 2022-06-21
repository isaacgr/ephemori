import React from "react";
import LandingFrame from "../components/LandingFrame";
import LandingPageFeatures from "../components/LandingPageFeatures";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import AssignmentIcon from "@mui/icons-material/Assignment";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <LandingFrame />
        <div
          style={{ marginTop: "0" }}
          className="content-block content-block--flex"
        >
          <Button
            sx={{ margin: "1rem" }}
            color="primary"
            variant="contained"
            onClick={() => {
              navigate("/signUp");
            }}
          >
            Sign Up <AssignmentIcon sx={{ marginLeft: ".3rem" }} />
          </Button>
          <Button
            sx={{ margin: "1rem" }}
            color="primary"
            variant="contained"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login <LoginIcon sx={{ marginLeft: ".3rem" }} />
          </Button>
        </div>
        <LandingPageFeatures />
      </div>
    </>
  );
};

export default LandingPage;
