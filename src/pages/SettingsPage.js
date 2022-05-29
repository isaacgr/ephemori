import React, { useContext } from "react";
import { UserInfo } from "../components/User";
import { ImportantDates } from "../components/ImportantDates";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import MenuBar from "../components/MenuBar";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import StateProvider from "../contexts/state/StateProvider";

const SettingsPage = () => {
  const state = useContext(StateProvider.context);
  const navigate = useNavigate();

  const handleComplete = async () => {
    await state.setUser({
      user: {
        ...state.user,
        isUserSet: true
      }
    });
    navigate("/my-grid", { replace: true });
  };

  return (
    <>
      <MenuBar />
      {state.error && <Alert severity="error">{state.error}</Alert>}
      <div className="container">
        <div className="content-block">
          <Typography
            sx={{ textTransform: "uppercase" }}
            variant="h6"
            component="div"
            gutterBottom
          >
            Set your Birthday
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            Will be the starting point of the Life Plot.
          </Typography>
        </div>
        <UserInfo dob={state.user.dateOfBirth} setUser={state.setUser} />
        <div className="content-block">
          <Divider />
        </div>
        <div className="content-block">
          <Typography
            sx={{ textTransform: "uppercase" }}
            variant="h6"
            component="div"
            gutterBottom
          >
            {`Choose up to ${state.maxDates} dates to highlight in the grid`}
          </Typography>
          <Typography variant="body1" component="div" gutterBottom>
            It's helpful to highlight dates of significance in your life.
            <br />
            These will help give some reference for reflection, and provide a
            visual timeline of events in your life so far.
          </Typography>
        </div>
        <ImportantDates
          importantDates={state.importantDates}
          removeImportantDates={state.removeImportantDates}
          addImportantDates={state.addImportantDates}
          maxDates={state.maxDates}
        />
      </div>
      <div className="content-block">
        <Button
          sx={{ marginBottom: "1rem" }}
          variant="contained"
          size="large"
          onClick={handleComplete}
        >
          Finish
        </Button>
      </div>
    </>
  );
};

export default SettingsPage;
