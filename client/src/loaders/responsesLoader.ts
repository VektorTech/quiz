import store from "@/app/store";
import baseAPI from "@/services/api";
import { LoaderFunctionArgs } from "react-router-dom";

const responsesLoader = async ({ params }: LoaderFunctionArgs) => {
  if (!params.quizID) {
    throw new Error("Quiz ID should be specified.");
  }

  const response = await store.dispatch(
    baseAPI.endpoints.getQuizResponsesById.initiate(params.quizID)
  );

  if (!response.data || response.isError) {
    throw response.error;
  }

  return { responses: response.data, quizID: params.quizID };
};

export type responsesLoaderReturn = Awaited<ReturnType<typeof responsesLoader>>;

export default responsesLoader;
