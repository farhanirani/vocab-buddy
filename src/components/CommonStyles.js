export const modalBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: "500px",
  minWidth: "300px",
  bgcolor: "background.paper",
  boxShadow: 10,

  boxSizing: "border-box",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& > .MuiTextField-root": {
    m: 0,
  },
  outline: "none",

  border: "6px solid #133266",
};
