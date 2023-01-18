import store from "@/app/store";
import { CATEGORIES } from "@/libs/constants";
import baseAPI from "@/services/api";
import { LoaderFunction } from "react-router-dom";

const quizzesLoader: LoaderFunction = async ({ params, request }) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) ?? 1;
  const search = searchParams.get("search") ?? "";
  const category = params.categoryID as typeof CATEGORIES[number];

  const response = await store.dispatch(
    baseAPI.endpoints.getQuizzes.initiate({
      page,
      category,
      search,
    })
  );

  if (!response.data || response.isError) {
    throw response.error;
  }

  return response.data;
};

export default quizzesLoader;
