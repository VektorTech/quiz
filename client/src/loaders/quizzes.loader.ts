import store from "@/app/store";
import { CATEGORIES } from "@/libs/constants";
import baseAPI from "@/services/api";
import { LoaderFunction } from "react-router-dom";

const quizzesLoader: LoaderFunction = async ({ params, request }) => {
  const page = Number(new URL(request.url).searchParams.get("page")) ?? 1;
  const category = params.categoryID as typeof CATEGORIES[number];

  const response = await store.dispatch(
    baseAPI.endpoints.getQuizzes.initiate({
      page,
      category,
    })
  );

  if (!response.data || response.isError) {
    throw response.error;
  }

  return response.data;
};

export default quizzesLoader;
