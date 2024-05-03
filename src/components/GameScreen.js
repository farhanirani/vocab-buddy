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
  const totalLives = 3;

  const [currentRandomPositionArray, setCurrentRandomPositionArray] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [randomThreePositions, setRandomThreePositions] = useState([]);

  const [hasTheQuestionBeenAnswered, setHasTheQuestionBeenAnswered] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);

  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (localStorage.getItem("game_complete_bool") === null) {
          localStorage.setItem("game_complete_bool", false);
        } else {
          setGameCompleted(localStorage.getItem("game_complete_bool") === "true");
        }

        if (localStorage.getItem("game_success_bool") === null) {
          localStorage.setItem("game_success_bool", false);
        } else {
          setGameSuccess(localStorage.getItem("game_success_bool") === "true");
        }

        if (localStorage.getItem("vocab_array") === null) {
          const wordArr = generateRandomArrayWithoutRepetition(VOCAB_WORDS.length);
          setCurrentRandomPositionArray(wordArr);
          localStorage.setItem("vocab_array", JSON.stringify(wordArr));
        } else {
          const retrievedArray = JSON.parse(localStorage.getItem("vocab_array"));
          setCurrentRandomPositionArray(retrievedArray);
        }

        // Current game position
        if (localStorage.getItem("curr_position") === null) {
          localStorage.setItem("curr_position", 0);
        } else {
          setCurrentPosition(parseInt(localStorage.getItem("curr_position")));
        }

        // Progress bar position
        if (localStorage.getItem("progress_position") === null) {
          localStorage.setItem("progress_position", 0);
        } else {
          setProgressPosition(parseInt(localStorage.getItem("progress_position")));
        }

        // Lives left
        if (localStorage.getItem("lives_left") === null) {
          localStorage.setItem("lives_left", totalLives);
        } else {
          const retrievedLives = parseInt(localStorage.getItem("lives_left"));
          setLivesLeft(retrievedLives);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setRandomThreePositions(generateRandomNumberArray(VOCAB_WORDS.length - 1, currentRandomPositionArray[currentPosition] - 1));
    setProgress(Math.ceil((progressPosition / VOCAB_WORDS.length) * 100));
  }, [currentPosition, progressPosition, currentRandomPositionArray]);

  // PLAYING THE CARD
  const gameCardClicked = (pos) => {
    if (!hasTheQuestionBeenAnswered) {
      setHasTheQuestionBeenAnswered(true);
      setIsCurrentAnswerCorrect(pos === currentRandomPositionArray[currentPosition] - 1);
      let checkSucc = true;
      const nextPosition = parseInt(currentPosition) + 1;

      // Wrong selection
      if (pos !== currentRandomPositionArray[currentPosition] - 1) {
        const newLives = livesLeft - 1;
        setLivesLeft(newLives);
        localStorage.setItem("lives_left", newLives);

        if (newLives <= 0) {
          alert("Game FAILED");
          localStorage.setItem("game_complete_bool", true);
          localStorage.setItem("game_success_bool", false);

          setGameCompleted(true);
          setGameSuccess(false);
          checkSucc = false;
        }
      } else {
        // Move progress bar ahead if answered successfully
        localStorage.setItem("progress_position", nextPosition);
        setProgressPosition(nextPosition);
      }

      // Game completed successfully
      if (checkSucc && nextPosition >= VOCAB_WORDS.length) {
        alert("SUCCESS");

        localStorage.setItem("game_complete_bool", true);
        localStorage.setItem("game_success_bool", true);

        setGameCompleted(true);
        setGameSuccess(true);
      }
    }
  };

  // Reset everything
  const handleRestartClicked = () => {
    setHasTheQuestionBeenAnswered(false);
    setGameCompleted(false);
    setGameSuccess(false);

    const wordArr = generateRandomArrayWithoutRepetition(VOCAB_WORDS.length);
    setCurrentRandomPositionArray(wordArr);
    localStorage.setItem("vocab_array", JSON.stringify(wordArr));

    setCurrentPosition(0);
    setProgressPosition(0);
    localStorage.setItem("curr_position", 0);
    localStorage.setItem("progress_position", 0);

    setLivesLeft(totalLives);
    localStorage.setItem("lives_left", totalLives);

    localStorage.setItem("game_complete_bool", false);
    localStorage.setItem("game_success_bool", false);
  };

  // Next button clicked
  const handleNavigateNext = () => {
    if (gameCompleted) {
      alert("GAME COMPLETE");
    } else {
      // Game still on
      setHasTheQuestionBeenAnswered(false);

      const nextPosition = parseInt(currentPosition) + 1;
      localStorage.setItem("curr_position", nextPosition);
      setCurrentPosition(nextPosition);

      if (!isCurrentAnswerCorrect) {
        localStorage.setItem("progress_position", nextPosition);
        setProgressPosition(nextPosition);
      }
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
              index < livesLeft ? (
                <FavoriteIcon fontSize="small" key={index} />
              ) : (
                <FavoriteBorderIcon fontSize="small" key={index} />
              )
            )}
          </div>
        </div>

        {gameCompleted && !gameSuccess && (
          <div style={{ fontFamily: "GFONTI", marginTop: "4px", fontSize: "10px", textAlign: "center", letterSpacing: "2px" }}>
            GAME OVER,
            <br /> TRY AGAIN ...
          </div>
        )}

        <div>
          {gameCompleted && gameSuccess ? (
            <>
              <div style={{ fontFamily: "GFONTI" }}>VICOTRY 🎉</div>
            </>
          ) : (
            <div style={{ fontFamily: "GFONTI" }}>
              <div>
                {progressPosition} / {VOCAB_WORDS.length}
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
              {gameCompleted && !hasTheQuestionBeenAnswered && <div style={{ width: "63.2px" }}></div>}
            </div>
            <div style={{ fontFamily: "GFONTB", fontSize: "32px", letterSpacing: "0.2px" }}>
              {VOCAB_WORDS[currentRandomPositionArray[currentPosition] - 1]?.Word}
            </div>
            <div>
              {!gameCompleted && hasTheQuestionBeenAnswered && (
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
              {gameCompleted && (
                <div
                  onClick={handleRestartClicked}
                  className="generic__border"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "200px",
                    alignContent: "center",
                    height: "60px",
                    width: "60px",
                  }}
                >
                  <RestartAltIcon sx={{ color: "#133266", fontSize: "42px" }} />
                </div>
              )}
            </div>
          </div>

          {/* meanings */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {gameCompleted || hasTheQuestionBeenAnswered ? (
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
