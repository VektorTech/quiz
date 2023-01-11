import store from "@/app/store";
import baseAPI from "@/services/api";
import { LoaderFunction } from "react-router-dom";

const quizLoader: LoaderFunction = async ({ params }) => {
  const response = await store.dispatch(
    baseAPI.endpoints.getQuizById.initiate(params.quizID || "")
  );

  if (!response.data || response.isError) {
    throw response.error;
  }

  return response.data;
};

export default quizLoader;
