import React, { useState, useEffect, useContext } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import Box from "@mui/material/Box";
import StateProvider from "../contexts/state/StateProvider";
import { USER_TIERS } from "../util/types";

const UpgradeBadge = ({ openUpgradeModal }) => {
  const { getUserTier, setError } = useContext(StateProvider.context);
  const [showBadge, setShowBadge] = useState(true);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        if (isMounted) {
          const response = await getUserTier();
          if (response.user.tier === USER_TIERS.premium) {
            setShowBadge(false);
          }
        }
      } catch (e) {
        if (isMounted) {
          setError(e.message);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);
  return showBadge ? (
    <Box sx={{ color: "action.active" }}>
      <IconButton className="upgrade-badge" onClick={openUpgradeModal}>
        <Badge color="secondary" variant="dot" overlap="circular">
          <WorkspacePremiumIcon />
        </Badge>
      </IconButton>
    </Box>
  ) : (
    <></>
  );
};

export default UpgradeBadge;
