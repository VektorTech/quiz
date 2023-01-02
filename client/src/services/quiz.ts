import { RootState } from "@/app/store";
import {
  createEntityAdapter,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserType } from "./user";

export interface QuizType {
  title: string;
  id: string;
  description: string;
  image: string;
  surveySchema: string;
  createdBy: UserType;
  likes: number;
  status: string;
  category: string;
  createdAt: string;
}

interface ListResponse<T> {
  count: number;
  numPages: number;
  currentPage: number;
  currentPageCount: number;
  data: T[];
}

type QuizListResponse = ListResponse<QuizType>;
type NormalizedQuizListResponse = EntityState<QuizType> &
  Omit<QuizListResponse, "data">;

const quizAdapter = createEntityAdapter<QuizType>();
const initialState = quizAdapter.getInitialState();

export const quizApi = createApi({
  reducerPath: "quizApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/",
  }),
  endpoints: (builder) => ({
    getQuizzes: builder.query<QuizListResponse, number | void>({
      query: (page = 1) => `quizzes?page=${page}`,
    }),
    getQuizzesFromCurrentUser: builder.query<NormalizedQuizListResponse, void>({
      query: () => "quizzes/user",
      transformResponse: (responseData: QuizListResponse) => {
        return {
          ...quizAdapter.setAll(initialState, responseData.data),
          ...responseData,
          data: undefined,
        };
      },
    }),
    getQuizById: builder.query<QuizType, string>({
      query: (id) => `quizzes/${id}`,
    }),
  }),
});

export const { useGetQuizzesQuery } = quizApi;

export const selectQuizzesFromCurrentUser =
  quizApi.endpoints.getQuizzesFromCurrentUser.select();

const selectCurrentUserQuizData = createSelector(
  selectQuizzesFromCurrentUser,
  (quizzes) => quizzes.data
);

export const {
  selectAll: selectAllQuizzesFromCurrentUser,
  selectById: selectQuizByIdFromCurrentUser,
} = quizAdapter.getSelectors<RootState>(
  (state) => selectCurrentUserQuizData(state) ?? initialState
);
