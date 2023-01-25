import store from "@/app/store";
import { CATEGORIES } from "@/utils/constants";
import baseAPI from "@/services/api";
import { LoaderFunctionArgs } from "react-router-dom";

const quizzesLoader = async ({ params, request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") ?? "";
  const category = params.categoryID as typeof CATEGORIES[number];

  if (category && !CATEGORIES.includes(category)) {
    throw new Error("Route Not Found");
  }

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

  return { quizzes: response.data, search, category };
};

export type quizzesLoaderReturn = Awaited<ReturnType<typeof quizzesLoader>>;

export default quizzesLoader;
