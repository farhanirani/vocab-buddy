import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Box from "@mui/material/Box";

import HomeScreen from "./components/HomeScreen";
import GameScreen from "./components/GameScreen";
import Root from "./components/Root";
import ErrorPage from "./components/ErrorPage";

import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
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
      <RouterProvider router={router} />
    </Box>
  );
}
export default App;
