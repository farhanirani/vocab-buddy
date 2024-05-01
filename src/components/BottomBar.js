import React from "react";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import GamepadIcon from "@mui/icons-material/Gamepad";
import SelectAllIcon from "@mui/icons-material/SelectAll";

import Paper from "@mui/material/Paper";

function BottomBar({ value, setValue }) {
  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          bgcolor: "gray",
          "& .Mui-selected": {
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: "white",
            },
          },
        }}
      >
        <BottomNavigationAction icon={<SelectAllIcon />} />
        <BottomNavigationAction icon={<GamepadIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomBar;
