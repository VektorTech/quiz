import { RootState } from "@/app/store";
import { QuizSchemaType } from "@/features/quiz/quizSlice";
import {
  createEntityAdapter,
  createSelector,
  EntityState,
} from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const quizAdapter = createEntityAdapter<QuizType>();
const initialState = quizAdapter.getInitialState();

const baseAPI = createApi({
  reducerPath: "appApiService",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/",
    credentials: "include",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getQuizzes: builder.query<QuizListResponse, number | void>({
      query: (page = 1) => `quizzes?page=${page}`,
    }),
    getAuthQuizzes: builder.query<NormalizedQuizListResponse, void>({
      query: () => "quizzes/user",
      transformResponse: (response: { data: QuizType[] }) => {
        return {
          ...quizAdapter.setAll(initialState, response.data),
          count: response.data.length,
          numPages: 1,
          currentPage: 1,
          currentPageCount: 1,
        };
      },
    }),
    getQuizById: builder.query<QuizType, string>({
      query: (id) => `quizzes/${id}`,
    }),
    findQuizBySlug: builder.query<QuizType, string>({
      query: (slug) => `quizzes/slug/${slug}`
    }),
    addQuiz: builder.mutation<{ data: QuizType }, QuizSchemaType>({
      query: (quizSchema) => ({
        url: "quizzes",
        method: "POST",
        body: {
          title: quizSchema.name,
          description: quizSchema.description,
          image: quizSchema.image,
          category: quizSchema.category,
          surveySchema: JSON.stringify(quizSchema),
        },
      }),
      invalidatesTags: ["User"],
    }),

    getAuthUser: builder.query<UserType, void>({
      query: () => "users/me",
      providesTags: ["User"],
    }),
  }),
});

export default baseAPI;

export interface UserType {
  avatar: {
    username: string;
    picture_url: string;
    bio: string;
  };
  email: string;
  name: string;
  country_abbr: string;
  gender: string | null;
  quizzes: QuizType[];
  likedQuizzes: QuizType[];
  followers: string[];
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isAuth: boolean;
}

export interface QuizType {
  title: string;
  id: string;
  description: string;
  image: string;
  surveySchema: string;
  createdBy: UserType;
  likes: number;
  status: string;
  slug: string;
  category: string;
  tags: string[];
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

export const {
  useGetQuizzesQuery,
  useAddQuizMutation,
  useGetAuthQuizzesQuery,
  useGetAuthUserQuery,
  useGetQuizByIdQuery,
} = baseAPI;

export const selectQuizzesFromCurrentUser =
  baseAPI.endpoints.getAuthQuizzes.select();

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
