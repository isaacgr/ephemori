import React, { useContext } from "react";
import { AgeStats } from "../components/User";
import Grid from "../components/Grid";
import { ImportantDatesTable } from "../components/ImportantDates";
import MenuBar from "../components/MenuBar";
import StateProvider from "../contexts/state/StateProvider";
import Alert from "@mui/material/Alert";

const MainPage = () => {
  const state = useContext(StateProvider.context);
  return (
    <>
      <MenuBar />
      {state.error && <Alert severity="error">{state.error}</Alert>}
      <div className="container">
        <div className="content-block content-block--flex">
          <Grid
            dateOfBirth={state.user.dateOfBirth}
            importantDates={state.importantDates}
          />
          <div style={{ width: "100%" }} className="content-block">
            <AgeStats dateOfBirth={state.user.dateOfBirth} />
            {state.importantDates.length !== 0 && (
              <ImportantDatesTable importantDates={state.importantDates} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default MainPage;
