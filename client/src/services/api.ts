import { RootState } from "@/app/store";
import { QuizSchemaType } from "@/features/quiz/quizSlice";
import { CATEGORIES } from "@/libs/constants";
import {
  createEntityAdapter,
  createSelector,
  EntityId,
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
  tagTypes: ["User", "Quiz"],
  endpoints: (builder) => ({
    getQuizzes: builder.query<
      QuizListResponse,
      {
        page?: number;
        category?: typeof CATEGORIES[number] | "";
        search?: string;
      } | void
    >({
      query: (
        { page, category, search } = {
          page: 1,
          category: "",
          search: "",
        }
      ) => `quizzes?page=${page}&category=${category}&search=${search}`,
      providesTags: ["Quiz"],
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
      providesTags: ["Quiz"],
    }),
    getQuizById: builder.query<QuizType, string>({
      query: (id) => `quizzes/${id}`,
    }),
    findQuizBySlug: builder.query<{ data: QuizType }, string>({
      query: (slug) => `quizzes/slug/${slug}`,
      providesTags: ["Quiz"],
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
          surveySchema: quizSchema,
        },
      }),
      invalidatesTags: ["User", "Quiz"],
    }),
    likeQuiz: builder.mutation<{ data: QuizType }, EntityId>({
      query: (quizId) => ({
        url: `quizzes/${quizId}/likes`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Quiz"],
    }),
    updateQuiz: builder.mutation<
      { data: QuizType },
      Partial<Omit<QuizType, "id">> & { id: EntityId }
    >({
      query: (field) => ({
        url: `quizzes/${field.id}`,
        method: "PATCH",
        body: field,
      }),
      invalidatesTags: ["User", "Quiz"],
    }),
    deleteQuiz: builder.mutation<string, string>({
      query: (id) => ({ url: `quizzes/${id}`, method: "DELETE" }),
      invalidatesTags: ["User", "Quiz"],
    }),

    getAuthUser: builder.query<UserType, void>({
      query: () => "users/me",
      providesTags: ["User"],
    }),

    addQuizResponse: builder.mutation<
      { data: QuizUserResponse },
      QuizUserResponse
    >({
      query: ({ quizID, answers, meta }) => ({
        url: "responses",
        method: "POST",
        body: {
          quiz: quizID,
          answers,
          meta,
        },
      }),
    }),
  }),
});

export default baseAPI;

interface QuizUserResponse {
  quizID: string;
  answers: object;
  meta: object;
}

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
  id: string;
  _id: string;
}

export interface QuizType {
  title: string;
  id: string;
  description: string;
  image: string;
  surveySchema: QuizSchemaType;
  createdBy: UserType;
  likes: number;
  status: "DRAFTED" | "ACTIVE" | "CLOSED";
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

export type QuizListResponse = ListResponse<QuizType>;
export type NormalizedQuizListResponse = EntityState<QuizType> &
  Omit<QuizListResponse, "data">;

export const {
  useGetQuizzesQuery,
  useGetAuthQuizzesQuery,
  useGetAuthUserQuery,
  useGetQuizByIdQuery,
  useFindQuizBySlugQuery,

  useAddQuizMutation,
  useAddQuizResponseMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useLikeQuizMutation,
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
