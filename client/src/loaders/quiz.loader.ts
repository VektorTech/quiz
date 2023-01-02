import store from "@/app/store";
import { quizApi } from "@/services/quiz";
import { LoaderFunction } from "react-router-dom";

const quizLoader: LoaderFunction = async ({ params }) => {
  const response = await store.dispatch(
    quizApi.endpoints.getQuizById.initiate(params.quizID || "")
  );

  if (!response.data || response.isError) {
    throw response.error;
  }

  return response.data;
};

export default quizLoader;
