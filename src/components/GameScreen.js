import React, { useEffect, useState } from "react";

import LinearProgress from "@mui/material/LinearProgress";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import StartIcon from "@mui/icons-material/Start";

import { VOCAB_WORDS } from "../constants";
import { modalBoxStyle } from "./CommonStyles";
import { Box, Modal } from "@mui/material";

import game_tut_img from "../assets/game_tut.png";

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
  const totalLives = 6;
  const [livesLeft, setLivesLeft] = useState(totalLives);
  const [loading, setLoading] = useState(false);

  const [currentRandomPositionArray, setCurrentRandomPositionArray] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [progressPosition, setProgressPosition] = useState(0);
  const [randomThreePositions, setRandomThreePositions] = useState([]);

  const [hasTheQuestionBeenAnswered, setHasTheQuestionBeenAnswered] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);

  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);

  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [gameFailedModalOpen, setGameFailedModalOpen] = useState(false);
  const [gameCompleteModalOpen, setGameCompleteModalOpen] = useState(false);

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

        // Current game position
        if (localStorage.getItem("curr_position") === null) {
          localStorage.setItem("curr_position", 0);
        } else {
          setCurrentPosition(parseInt(localStorage.getItem("curr_position")));
        }

        // Progress bar position
        if (localStorage.getItem("progress_position") === null) {
          localStorage.setItem("progress_position", 0);
          setWelcomeModalOpen(true);
        } else {
          const retValue = parseInt(localStorage.getItem("progress_position"));
          setProgressPosition(retValue);
          setWelcomeModalOpen(retValue === 0);
        }

        // Lives left
        if (localStorage.getItem("lives_left") === null) {
          localStorage.setItem("lives_left", totalLives);
        } else {
          const retrievedLives = parseInt(localStorage.getItem("lives_left"));
          setLivesLeft(retrievedLives);
        }

        // Has the question been answered
        if (localStorage.getItem("question__answered") === null) {
          localStorage.setItem("question__answered", false);
        } else {
          setHasTheQuestionBeenAnswered(localStorage.getItem("question__answered") === "true");
        }

        // The entire mixed array of positions
        if (localStorage.getItem("vocab_array") === null) {
          const wordArr = generateRandomArrayWithoutRepetition(VOCAB_WORDS.length);
          setCurrentRandomPositionArray(wordArr);
          localStorage.setItem("vocab_array", JSON.stringify(wordArr));
        } else {
          const retrievedArray = JSON.parse(localStorage.getItem("vocab_array"));

          if (retrievedArray.length === VOCAB_WORDS.length) {
            setCurrentRandomPositionArray(retrievedArray);
          } else {
            // If the words have been updated
            handleRestartClicked();
          }
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
      localStorage.setItem("question__answered", true);

      setIsCurrentAnswerCorrect(pos === currentRandomPositionArray[currentPosition] - 1);
      let checkSucc = true;
      const nextPosition = parseInt(currentPosition) + 1;

      // Wrong selection
      if (pos !== currentRandomPositionArray[currentPosition] - 1) {
        const newLives = livesLeft - 1;
        setLivesLeft(newLives);
        localStorage.setItem("lives_left", newLives);

        if (newLives <= 0) {
          setGameFailedModalOpen(true);
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
        setGameCompleteModalOpen(true);

        localStorage.setItem("game_complete_bool", true);
        localStorage.setItem("game_success_bool", true);

        setGameCompleted(true);
        setGameSuccess(true);
      }
    }
  };

  // Reset everything
  const handleRestartClicked = () => {
    setGameCompleteModalOpen(false);
    setGameFailedModalOpen(false);

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

    localStorage.setItem("question__answered", false);
    localStorage.setItem("game_complete_bool", false);
    localStorage.setItem("game_success_bool", false);
  };

  // Next button clicked
  const handleNavigateNext = () => {
    if (gameCompleted) {
      setGameCompleteModalOpen(true);
    } else {
      // Game still on
      setHasTheQuestionBeenAnswered(false);
      localStorage.setItem("question__answered", false);

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
                <div key={idx} className="game__card generic__border" onClick={() => gameCardClicked(pos)}>
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

      {/* MODALS */}
      <Modal open={welcomeModalOpen} onClose={() => setWelcomeModalOpen(false)}>
        <Box sx={modalBoxStyle}>
          <h2>\\ The Vocab Game //</h2>
          <div style={{ fontSize: "12px", textAlign: "center", marginBottom: "6px" }}>
            Select the correct meaning to advance!
          </div>
          <img
            alt="guide_image"
            src={game_tut_img}
            style={{ width: "240px", marginBottom: "20px", border: "2px solid #133266", borderRadius: "2px" }}
          />
        </Box>
      </Modal>

      <Modal open={gameFailedModalOpen} onClose={() => setGameFailedModalOpen(false)}>
        <Box sx={modalBoxStyle}>
          <h2>Game over, try again :( </h2>
          <div
            onClick={handleRestartClicked}
            className="generic__border"
            style={{ backgroundColor: "white", borderRadius: "200px", height: "50px", width: "50px", marginBottom: "20px" }}
          >
            <RestartAltIcon sx={{ color: "#133266", fontSize: "48px" }} />
          </div>
        </Box>
      </Modal>

      <Modal open={gameCompleteModalOpen}>
        <Box sx={modalBoxStyle}>
          <h2> /🎉/🎉 VICTORY🎉\🎉\ </h2>
          <div style={{ fontSize: "16px", textAlign: "center", marginTop: "10px", marginBottom: "16px" }}>
            Congratulations! Well done!!
          </div>
          <div style={{ fontSize: "16px", textAlign: "center", marginBottom: "16px" }}>
            Give youreself a pat on the back, you deserve it!
          </div>
          {/* <div style={{ fontSize: "15px", textAlign: "center", marginBottom: "6px" }}>
            You are worthy of being bought a coffee
          </div> 
          <img alt="coffee_img" src={coffee_img} style={{ width: "240px", marginBottom: "20px" }} /> */}
          <div
            onClick={handleRestartClicked}
            className="generic__border"
            style={{ backgroundColor: "white", borderRadius: "200px", height: "50px", width: "50px", marginBottom: "20px" }}
          >
            <RestartAltIcon sx={{ color: "#133266", fontSize: "48px" }} />
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default GameScreen;
