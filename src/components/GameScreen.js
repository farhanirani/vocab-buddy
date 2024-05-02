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

function generateRandomNumberArray(n, actual) {
  const random1 = Math.floor(Math.random() * (n + 1));
  const random2 = Math.floor(Math.random() * (n + 1));
  // Create an array containing the two random numbers and the actual number
  const numbers = [random1, random2, actual];

  // Shuffle the array
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function GameScreen() {
  const [progress, setProgress] = useState(70);
  const [livesLeft, setLivesLeft] = useState(5);
  const [currentRandomPositionArray, setCurrentRandomPositionArray] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [currentRandomPostionBased, setCurrentRandomPostionBased] = useState(0);
  const [randomThreePositions, setRandomThreePositions] = useState([]);

  const [loading, setLoading] = useState(false);
  const totalLives = 5;
  const totalWords = VOCAB_WORDS.length;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (localStorage.getItem("vocab_array") === null) {
          const wordArr = generateRandomArrayWithoutRepetition(totalWords);
          setCurrentRandomPositionArray(wordArr);
          localStorage.setItem("vocab_array", JSON.stringify(wordArr));
        } else {
          const retrievedArray = JSON.parse(localStorage.getItem("vocab_array"));
          setCurrentRandomPositionArray(retrievedArray);
        }

        if (localStorage.getItem("curr_position") === null) {
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

  useEffect(() => {
    setRandomThreePositions(generateRandomNumberArray(totalWords, currentRandomPositionArray[currentPosition] - 1));
  }, [currentPosition]);

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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            className="generic__border"
            style={{ backgroundColor: "white", borderRadius: "200px", height: "36px", width: "36px" }}
          >
            <RestartAltIcon sx={{ color: "#133266", fontSize: "34px" }} />
          </div>
          <div>
            {[...Array(totalLives)].map((_, index) =>
              index < livesLeft ? <FavoriteIcon key={index} /> : <FavoriteBorderIcon key={index} />
            )}
          </div>
        </div>
        {/* <div style={{ fontFamily: "GFONTI", marginTop: "4px", fontSize: "20px", textAlign: "center", letterSpacing: "2px" }}>
          GAME
        </div> */}
        <div>
          <div>
            {currentPosition} / {totalWords}
          </div>
          <LinearProgress
            sx={{
              width: "80px",
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
      {loading || !(currentRandomPositionArray.length > 0) ? (
        <>loading...</>
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          <div style={{ fontFamily: "GFONTB", margin: "30px 0px", fontSize: "32px", letterSpacing: "0.2px" }}>
            {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1].Word}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {randomThreePositions.map((pos) => (
              <div className="game__card generic__border">{VOCAB_WORDS[pos]?.Meaning}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameScreen;
