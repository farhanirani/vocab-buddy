import React from "react";
import { useNavigate } from "react-router-dom";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import GamepadOutlinedIcon from "@mui/icons-material/GamepadOutlined";

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
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={6}>
      <BottomNavigation
        value={getValue(urlPage)}
        sx={{
          bgcolor: "#efc1c4",
          "& .MuiBottomNavigationAction-root": {
            color: "#a07a7c",
          },
          "& .Mui-selected": {
            opacity: "1",
            "& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label": {
              color: "#133266",
            },
          },
          "& .MuiBottomNavigationAction-label": {
            border: "none !important",
            transition: "none !important",
          },
        }}
      >
        <BottomNavigationAction
          disableRipple
          icon={<SelectAllIcon sx={{ fontSize: 30 }} />}
          onClick={() => navigate("/home")}
        />
        <BottomNavigationAction
          disableRipple
          icon={<GamepadOutlinedIcon sx={{ fontSize: 28 }} />}
          onClick={() => navigate("/game")}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomBar;
