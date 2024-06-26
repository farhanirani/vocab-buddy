import React, { useEffect, useRef, useState } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { VOCAB_WORDS } from "../constants";

function HomeScreen() {
  const [bookmarkPosition, setBookmarkPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const vocabRefs = useRef([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (localStorage.getItem("bookmark__position") === null) {
          localStorage.setItem("bookmark__position", bookmarkPosition);
        } else {
          const retrievedPosition = parseInt(localStorage.getItem("bookmark__position"));
          setBookmarkPosition(retrievedPosition);
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (vocabRefs.current[bookmarkPosition]) {
      vocabRefs.current[bookmarkPosition].scrollIntoView({ behavior: "smooth" });
    }
  }, [bookmarkPosition]);

  const homeWordCardClicked = (position) => {
    setBookmarkPosition(position);
    localStorage.setItem("bookmark__position", position);
  };

  if (loading) {
    return <div style={{ marginTop: "200px", fontSize: "30px", textAlign: "center" }}>loading...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: "GFONTB", marginTop: "60px", fontSize: "32px", letterSpacing: "0.2px" }}>
        \\ VOCAB BUDDY //
      </div>
      <div style={{ fontFamily: "GFONTI", marginTop: "4px", fontSize: "13px", textAlign: "center" }}>
        Master the English vocabulary, one word at a time!
      </div>
      <div style={{ fontSize: "8px", fontFamily: "GFONTI", marginTop: "4px", marginBottom: "30px" }}>
        (Words taken for GRE, IELTS and TOEFL)
      </div>

      {VOCAB_WORDS.map((word, idx) => (
        <div
          key={idx}
          ref={(el) => (vocabRefs.current[idx] = el)}
          className="home__word__card generic__border"
          onClick={() => homeWordCardClicked(idx)}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "GFONTB", fontSize: "24px" }}>{word.Word}</div>

            {idx === bookmarkPosition && <BookmarkIcon />}
          </div>

          <div style={{ marginTop: "4px", fontSize: "20px" }}>{word.Meaning}</div>

          {(word.Sentences.length > 0 || word.Synonyms.length > 0) && <div style={{ height: "30px" }}></div>}

          {word.Sentences.length > 0 && (
            <div style={{ fontSize: "18px" }}>
              <span style={{ fontFamily: "GFONTB" }}> Sentences: </span>
              {word.Sentences}
            </div>
          )}

          {word.Sentences.length > 0 && word.Synonyms.length > 0 && <div style={{ height: "20px" }}></div>}

          {word.Synonyms.length > 0 && (
            <div style={{ fontSize: "18px" }}>
              <span style={{ fontFamily: "GFONTB" }}> Synonyms: </span>
              {word.Synonyms}
            </div>
          )}
        </div>
      ))}

      <div style={{ height: "20px" }}></div>
    </div>
  );
}

export default HomeScreen;
