import React, { useEffect, useState } from "react";

import LinearProgress from "@mui/material/LinearProgress";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { VOCAB_WORDS } from "../constants";

function generateRandomArrayWithoutRepetition(n) {
  return Array.from({ length: n }, (_, index) => index + 1)
    .sort(() => Math.random() - 0.5)
    .slice(0, n);
}

function GameScreen() {
  const [progress, setProgress] = useState(70);
  const [livesLeft, setLivesLeft] = useState(5);
  const [currentWordArray, setCurrentWordArray] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const totalLives = 5;
  const totalWords = VOCAB_WORDS.length;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (localStorage.getItem("vocab_array") === null) {
          const wordArr = generateRandomArrayWithoutRepetition(totalWords);
          setCurrentWordArray(wordArr);
          localStorage.setItem("vocab_array", JSON.stringify(wordArr));
        } else {
          const retrievedArray = JSON.parse(localStorage.getItem("vocab_array"));
          setCurrentWordArray(retrievedArray);
        }

        if (localStorage.getItem("curr_position") === null) {
          console.log("bruh");
          setCurrentPosition(0);
          localStorage.setItem("curr_position", 0);
        } else {
          const retrievedPos = localStorage.getItem("curr_position");
          setCurrentPosition(retrievedPos);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "18px" }}>
      <div
        style={{
          width: "94%",
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "200px", height: "36px", width: "36px" }}>
            <RestartAltIcon sx={{ color: "#133266", fontSize: "32px" }} />
          </div>
          <div>
            {[...Array(totalLives)].map((_, index) =>
              index < livesLeft ? <FavoriteIcon key={index} /> : <FavoriteBorderIcon key={index} />
            )}
          </div>
        </div>
        <div style={{ fontFamily: "GFONTI", marginTop: "4px", fontSize: "22px", textAlign: "center", letterSpacing: "2px" }}>
          GAME
        </div>
        <div>
          <div>
            {currentPosition} / {totalWords}
          </div>
          <LinearProgress
            sx={{
              width: "140px",
              marginTop: "4px",
              backgroundColor: "white",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#133266",
              },
            }}
            variant="determinate"
            value={progress}
          />
        </div>
      </div>
    </div>
  );
}

export default GameScreen;
