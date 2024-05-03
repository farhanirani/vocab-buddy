import React, { useEffect, useState } from "react";

import LinearProgress from "@mui/material/LinearProgress";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import StartIcon from "@mui/icons-material/Start";

import { VOCAB_WORDS } from "../constants";

function generateRandomArrayWithoutRepetition(n) {
  return Array.from({ length: n }, (_, index) => index + 1)
    .sort(() => Math.random() - 0.5)
    .slice(0, n);
}

function generateRandomNumberArray(n, actual) {
  const random1 = Math.floor(Math.random() * (n + 1));
  const random2 = Math.floor(Math.random() * (n + 1));
  const numbers = [random1, random2, actual];

  // Shuffle the array
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function GameScreen() {
  const [progress, setProgress] = useState(0);
  const [livesLeft, setLivesLeft] = useState(5);
  const [loading, setLoading] = useState(false);
  const totalLives = 5;

  const [currentRandomPositionArray, setCurrentRandomPositionArray] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [randomThreePositions, setRandomThreePositions] = useState([]);

  const [hasTheQuestionBeenAnswered, setHasTheQuestionBeenAnswered] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);

  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (localStorage.getItem("vocab_array") === null) {
          const wordArr = generateRandomArrayWithoutRepetition(VOCAB_WORDS.length);
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

        if (localStorage.getItem("lives_left") === null) {
          localStorage.setItem("lives_left", 5);
        } else {
          const retrievedLives = localStorage.getItem("lives_left");
          setLivesLeft(retrievedLives);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setRandomThreePositions(generateRandomNumberArray(VOCAB_WORDS.length - 1, currentRandomPositionArray[currentPosition] - 1));
    setProgress(Math.ceil((currentPosition / VOCAB_WORDS.length) * 100));
  }, [currentPosition, currentRandomPositionArray]);

  const gameCardClicked = (pos) => {
    if (!hasTheQuestionBeenAnswered) {
      setHasTheQuestionBeenAnswered(true);
      setIsCurrentAnswerCorrect(pos === currentRandomPositionArray[currentPosition] - 1);

      // Wrong selection
      if (pos !== currentRandomPositionArray[currentPosition] - 1) {
        const newLives = livesLeft - 1;
        if (newLives <= 0) {
          console.log("game over");
          setLivesLeft(5);
          localStorage.setItem("lives_left", 5);
        } else {
          setLivesLeft(newLives);
          localStorage.setItem("lives_left", newLives);
        }
      }

      // Game completed successfully
      const nextPosition = parseInt(currentPosition) + 1;
      if (nextPosition === VOCAB_WORDS.length) {
        alert("SUCCESS");
        setGameCompleted(true);
      }
    }
  };

  // Reset everything
  const handleRestartClicked = () => {
    setHasTheQuestionBeenAnswered(false);
    setGameCompleted(false);

    const wordArr = generateRandomArrayWithoutRepetition(VOCAB_WORDS.length);
    setCurrentRandomPositionArray(wordArr);
    localStorage.setItem("vocab_array", JSON.stringify(wordArr));

    setCurrentPosition(0);
    localStorage.setItem("curr_position", 0);

    setLivesLeft(5);
    localStorage.setItem("lives_left", 5);
  };

  const handleNavigateNext = () => {
    const nextPosition = parseInt(currentPosition) + 1;

    // Game completed successfully
    if (nextPosition === VOCAB_WORDS.length) {
      alert("SUCCESS");
      setGameCompleted(true);
      // Game still on
    } else {
      setHasTheQuestionBeenAnswered(false);
      setCurrentPosition(nextPosition);
      localStorage.setItem("curr_position", nextPosition);
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "18px auto 0 auto", maxWidth: "700px" }}
    >
      <div
        style={{
          width: "94%",
          display: "flex",
          justifyContent: "space-between",
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            onClick={handleRestartClicked}
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
          {gameCompleted ? (
            <>
              <div style={{ fontFamily: "GFONTI" }}>FIN...</div>
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
                value={100}
              />
            </>
          ) : (
            <>
              <div>
                {currentPosition} / {VOCAB_WORDS.length}
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
            </>
          )}
        </div>
      </div>
      {loading || !(currentRandomPositionArray.length > 0) ? (
        <>loading...</>
      ) : (
        <div style={{ width: "100%", textAlign: "center" }}>
          {/* main word */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "30px auto 10px auto",
              height: "60px",
              width: "90%",
            }}
          >
            <div>
              {hasTheQuestionBeenAnswered && isCurrentAnswerCorrect && <CheckIcon sx={{ color: "green", width: "63.2px" }} />}
              {hasTheQuestionBeenAnswered && !isCurrentAnswerCorrect && <ClearIcon sx={{ color: "red", width: "63.2px" }} />}
            </div>
            <div style={{ fontFamily: "GFONTB", fontSize: "32px", letterSpacing: "0.2px" }}>
              {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Word}
            </div>
            <div>
              {hasTheQuestionBeenAnswered && (
                <div
                  onClick={handleNavigateNext}
                  className="generic__border"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "200px",
                    alignContent: "center",
                    height: "60px",
                    width: "60px",
                  }}
                >
                  <StartIcon sx={{ color: "#133266", fontSize: "42px" }} />
                </div>
              )}
            </div>
          </div>

          {/* meanings */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {hasTheQuestionBeenAnswered ? (
              <div className="game__card generic__border">
                {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Meaning}
              </div>
            ) : (
              randomThreePositions.map((pos, idx) => (
                <div
                  key={idx}
                  className="game__card generic__border"
                  onClick={() => gameCardClicked(pos)}
                  // style={{
                  //   backgroundColor:
                  //     hasTheQuestionBeenAnswered && pos === currentRandomPositionArray[currentPosition] - 1 ? "#30ff30" : "white",
                  // }}
                >
                  {VOCAB_WORDS[pos]?.Meaning}
                </div>
              ))
            )}
          </div>

          <div style={{ width: "92%", maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
            {(VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Sentences.length > 0 ||
              VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Synonyms.length > 0) && (
              <div style={{ height: "32px" }}></div>
            )}
            {/* sentences */}
            {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Sentences.length > 0 && (
              <div>
                <span style={{ fontFamily: "GFONTB" }}> Sentences: </span>
                {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Sentences}
              </div>
            )}

            {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Sentences.length > 0 &&
              VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Synonyms.length > 0 && (
                <div style={{ height: "14px" }}></div>
              )}
            {/* synonyms */}
            {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Synonyms.length > 0 && (
              <div>
                <span style={{ fontFamily: "GFONTB" }}> Synonyms: </span>
                {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Synonyms}
              </div>
            )}

            <div style={{ height: "32px" }}></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameScreen;
