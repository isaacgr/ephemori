import React, { useState, useEffect } from "react";
import { GithubPicker } from "react-color";
import Button from "@mui/material/Button";
import DatePicker from "../DatePicker";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import { getDateString } from "../../util/dates";
import { colors } from "../../util/constants";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { green } from "@mui/material/colors";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ImportantDateSelector = ({
  maxDates,
  importantDates,
  addImportantDates
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [addButtonDisabled, setAddButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [item, setItem] = useState({
    date: getDateString(new Date()),
    color: colors[0],
    significance: ""
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (importantDates.length >= maxDates) {
      setAddButtonDisabled(true);
    } else {
      setAddButtonDisabled(false);
    }
  }, [importantDates]);

  return (
    <div className="content-block--flex important-dates__selector">
      <div className="dropdown">
        <Button
          variant="contained"
          id="color-picker__button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          endIcon={<KeyboardArrowDownIcon />}
          style={{ backgroundColor: selectedColor }}
        >
          Date Color
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            id: "color-picker__list",
            "aria-labelledby": "color-picker"
          }}
        >
          <MenuItem
            onClick={handleClose}
            id="color-picker__item"
            children={
              <GithubPicker
                colors={colors}
                color={item.color || colors[0]}
                onChangeComplete={(color) => {
                  setSelectedColor(color.hex);
                  setItem((item) => ({
                    ...item,
                    color: color.hex
                  }));
                }}
              />
            }
          ></MenuItem>
        </Menu>
      </div>
      <div className="content-block">
        <DatePicker
          disableFuture={false}
          label="Date"
          value={startDate}
          onChange={(date) => {
            setStartDate(date);
            setItem((item) => ({
              ...item,
              date: getDateString(date)
            }));
          }}
        />
      </div>
      <div className="content-block">
        <TextField
          label="Significance"
          size="small"
          onChange={(e) =>
            setItem((item) => ({
              ...item,
              significance: e.target.value
            }))
          }
        />
      </div>
      <div className="content-block">
        <Box sx={{ m: 1, position: "relative" }}>
          <Button
            variant="outlined"
            color="success"
            disabled={loading || addButtonDisabled}
            onClick={async () => {
              setLoading(true);
              await addImportantDates([item]);
              setLoading(false);
              setItem((item) => ({ ...item }));
            }}
          >
            <AddIcon />
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: green[500],
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px"
              }}
            />
          )}
        </Box>
      </div>
    </div>
  );
};

export default ImportantDateSelector;
