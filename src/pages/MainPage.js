import React, { useContext, useEffect, useState } from "react";
import { AgeStats } from "../components/User";
import Grid from "../components/Grid";
import { ImportantDatesTable } from "../components/ImportantDates";
import MenuBar from "../components/MenuBar";
import StateProvider from "../contexts/state/StateProvider";
import Alert from "@mui/material/Alert";
import WaterMark from "../components/WaterMark";
import LoadingBar from "../components/LoadingBar";

const MainPage = () => {
  const state = useContext(StateProvider.context);
  const [text, setText] = useState("ephemori.com");
  const [error, setError] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);

  const beginAlarm = async function () {
    const showWaterMark = await show();
    if (!showWaterMark) {
      return;
    }
    window.location.reload();
  };
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (isMounted) {
          setLoadingPage(true);
          const response = await state.getUserTier();
          if (response.user.tier !== 1) {
            setText("");
          }
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message);
          setLoadingPage(false);
        }
      } finally {
        if (isMounted) {
          setLoadingPage(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <>
      <MenuBar />
      {state.error && <Alert severity="error">{state.error}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <div className="container">
        {loadingPage ? (
          <LoadingBar />
        ) : (
          <WaterMark text={text} show={beginAlarm}>
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
          </WaterMark>
        )}
      </div>
    </>
  );
};
export default MainPage;
