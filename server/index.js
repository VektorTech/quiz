import app from "./src/index.js";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});