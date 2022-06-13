import React, { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import UpgradeBadge from "./UpgradeBadge";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4
};

export default function BasicModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const upgradeBenefits = [
    "Remove water mark",
    "Add up to 100 important dates",
    "Add future important dates",
    "Increase number of rows on the grid"
  ];

  return (
    <div>
      <UpgradeBadge openUpgradeModal={handleOpen} />
      <Modal
        className="upgrade-modal"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Premium Features
          </Typography>
          <List dense={true}>
            {upgradeBenefits.map((benefit) => {
              return (
                <ListItem key={benefit}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={benefit} />
                </ListItem>
              );
            })}
          </List>
          <Button color="secondary" variant="contained">
            Upgrade to Premium
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
