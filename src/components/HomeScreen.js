import React from "react";

import { VOCAB_WORDS } from "../constants";

function HomeScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ fontFamily: "GFONTB", marginTop: "60px", fontSize: "32px", letterSpacing: "0.2px" }}>VOCAB BUDDY</div>
      <div style={{ fontFamily: "GFONTI", marginTop: "4px", fontSize: "13px", textAlign: "center" }}>
        Master the English vocabulary, one word at a time!
      </div>
      <div style={{ fontSize: "8px", fontFamily: "GFONTI", marginTop: "4px", marginBottom: "30px" }}>
        (Words taken for GRE, IELTS and TOEFL)
      </div>

      {VOCAB_WORDS.map((word, idx) => (
        <div key={idx} className="home__word__card generic__border">
          <div style={{ fontFamily: "GFONTB", fontSize: "18px" }}>{word.Word}</div>
          <div style={{ marginTop: "2px", fontSize: "16px" }}>{word.Meaning}</div>

          {(word.Sentences.length > 0 || word.Synonyms.length > 0) && <div style={{ height: "24px" }}></div>}

          {word.Sentences.length > 0 && (
            <div style={{ fontSize: "14px" }}>
              <span style={{ fontFamily: "GFONTB" }}> Sentences: </span>
              {word.Sentences}
            </div>
          )}

          {word.Sentences.length > 0 && word.Synonyms.length > 0 && <div style={{ height: "14px" }}></div>}

          {word.Synonyms.length > 0 && (
            <div style={{ fontSize: "14px" }}>
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
