import React from "react";
import { useNavigate } from "react-router-dom";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import GamepadIcon from "@mui/icons-material/Gamepad";
import SelectAllIcon from "@mui/icons-material/SelectAll";

import Paper from "@mui/material/Paper";

function BottomBar({ value, setValue }) {
  const navigate = useNavigate();
  const urlPage = window.location.pathname.substring(1).split("/")[0];
  const urlArrays = ["home", "game"];

  const getValue = (key) => {
    if (urlArrays.includes(urlPage)) return urlArrays.indexOf(urlPage);
    return 0;
  };

  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        value={getValue(urlPage)}
        sx={{
          bgcolor: "black",

          "& .Mui-selected": {
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: "white",
            },
          },
          "& .MuiBottomNavigationAction-label": {
            border: "none !important",
            transition: "none !important",
          },
        }}
      >
        <BottomNavigationAction
          sx={{ color: "#5e5e5e" }}
          disableRipple
          icon={<SelectAllIcon />}
          onClick={() => navigate("/home")}
        />
        <BottomNavigationAction
          sx={{ color: "#5e5e5e" }}
          disableRipple
          icon={<GamepadIcon />}
          onClick={() => navigate("/game")}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomBar;
