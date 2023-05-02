import app, { mongooseClient } from "./src/index.js";

const PORT = process.env.PORT || 3001;

mongooseClient.then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
  });
});