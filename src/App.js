import React, { useState, useEffect } from "react";

import { VOCAB_WORDS } from "./constants";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import BottomBar from "./components/BottomBar";

import "./App.css";

function refreshMessages() {
  const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

  return Array.from(new Array(10)).map(() => messageExamples[getRandomInt(messageExamples.length)]);
}

const messageExamples = [
  {
    primary: "Brunch this week?",
    secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "Birthday Gift",
    secondary: `Do you have a suggestion for a good present for John on his work
      anniversary. I am really confused & would love your thoughts on it.`,
    person: "/static/images/avatar/1.jpg",
  },
];

function App() {
  const [value, setValue] = React.useState(0);
  const [messages, setMessages] = React.useState(() => refreshMessages());

  React.useEffect(() => {
    setMessages(refreshMessages());
  }, [value, setMessages]);

  return (
    <Box sx={{ pb: 7 }}>
      <List>
        {messages.map(({ primary, secondary, person }, index) => (
          <ListItemButton key={index + person}>
            <ListItemAvatar>
              <Avatar alt="Profile Picture" src={person} />
            </ListItemAvatar>
            <ListItemText primary={primary} secondary={secondary} />
          </ListItemButton>
        ))}
      </List>
      <BottomBar value={value} setValue={setValue} />
    </Box>
  );
}
export default App;
