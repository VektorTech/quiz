import { LoaderFunction } from "react-router-dom";

const quizLoader: LoaderFunction = async ({ params, request }) => {
  // const quiz = await axios.get("/quiz-id", { signal: request.signal });
  // if (!quiz {
  //     throw new Response("", {
  //       status: 404,
  //       statusText: "Not Found",
  //     });
  //   }
  //   return { quiz };
  return {};
}

export default quizLoader;
