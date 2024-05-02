import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";

import BottomBar from "./components/BottomBar";
import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import Root from "./components/Root";

import "./App.css";

export const muiBaseTheme = createTheme({
  typography: {
    fontFamily: "Roboto Mono",
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <HomeScreen /> },
      { path: "/home", element: <HomeScreen /> },
      { path: "/game", element: <GameScreen /> },
    ],
  },
]);

function App() {
  return (
    <Box sx={{ pb: 7 }}>
      <ThemeProvider theme={muiBaseTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Box>
  );
}
export default App;
