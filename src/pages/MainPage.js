import React, { useContext, useEffect, useState } from "react";
import { AgeStats } from "../components/User";
import Grid from "../components/Grid";
import { ImportantDatesTable } from "../components/ImportantDates";
import MenuBar from "../components/MenuBar";
import StateProvider from "../contexts/state/StateProvider";
import Alert from "@mui/material/Alert";
import WaterMarkWrapper from "../components/WaterMarkWrapper";
import LoadingBar from "../components/LoadingBar";
import { USER_TIERS } from "../util/types";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";

const MainPage = () => {
  const state = useContext(StateProvider.context);
  const [text, setText] = useState("ephemori.com");
  const [error, setError] = useState("");
  const [loadingPage, setLoadingPage] = useState(false);
  const matches = useMediaQuery("(max-width:600px)");

  const beginAlarm = async function () {
    window.location.reload();
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (isMounted) {
          setLoadingPage(true);
          const response = await state.getUserTier();
          if (response.user.tier === USER_TIERS.premium) {
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
          <WaterMarkWrapper text={text} beginAlarm={beginAlarm}>
            <Box
              sx={
                matches ? { flexDirection: "column", alignItems: "center" } : {}
              }
              className="content-block content-block--flex"
            >
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
            </Box>
          </WaterMarkWrapper>
        )}
      </div>
    </>
  );
};
export default MainPage;
