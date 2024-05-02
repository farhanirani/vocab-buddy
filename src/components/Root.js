import React from "react";
import { Outlet } from "react-router-dom";
import BottomBar from "./BottomBar";

function Root() {
  return (
    <>
      <Outlet />
      <BottomBar />
    </>
  );
}

export default Root;
