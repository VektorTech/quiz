import { RootState } from "@/app/store";
import { QuizSchemaType } from "@/features/quiz/quizSlice";
import { CATEGORIES, SERVER_ADDRESS } from "@/utils/constants";
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
    baseUrl: `${SERVER_ADDRESS}/api/`,
    credentials: "include",
  }),
  tagTypes: ["User", "Quiz", "ViewUser", "ResponsesCount"],
  endpoints: (builder) => ({
    getQuizzes: builder.query<
      QuizListResponse,
      {
        page?: number;
        category?: typeof CATEGORIES[number] | "";
        search?: string;
      } | void
    >({
      query: ({ page = 1, category = "", search = "" } = {}) =>
        `quizzes?page=${page}&category=${category}&search=${search}`,
      providesTags: ["Quiz"],
    }),

    getAuthQuizzes: builder.query<
      NormalizedQuizListResponse,
      {
        page?: number;
        category?: typeof CATEGORIES[number] | "";
        search?: string;
      } | void
    >({
      query: ({ page = 1, category = "", search = "" } = {}) =>
        `quizzes/user?page=${page}&category=${category}&search=${search}`,
      transformResponse: (response: QuizListResponse) => {
        return {
          ...quizAdapter.setAll(initialState, response.data),
          ...response,
          data: undefined,
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
      query: (quizSchema) => {
        const formData = new FormData();

        const updatedSchema = {
          title: quizSchema.name,
          description: quizSchema.description,
          image: quizSchema.image,
          category: quizSchema.category,
          surveySchema: quizSchema,
        };

        Object.entries(updatedSchema).forEach(([key, value]) => {
          if (value instanceof FileList) {
            formData.append(key, value[0] ?? "");
          } else if (typeof value == "object") {
            formData.append(key, JSON.stringify(value));
          } else if (value) {
            formData.append(key, value.toString());
          }
        });

        return {
          url: "quizzes",
          method: "POST",
          body: formData,
        };
      },
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
      Partial<Omit<QuizType<FileList>, "id">> & { id: EntityId }
    >({
      query: (field) => {
        const formData = new FormData();

        Object.entries(field).forEach(([key, value]) => {
          if (value instanceof FileList) {
            formData.append(key, value[0] ?? "");
          } else if (typeof value == "object") {
            formData.append(key, JSON.stringify(value));
          } else if (value) {
            formData.append(key, value.toString());
          }
        });

        return {
          url: `quizzes/${field.id}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User", "Quiz"],
    }),

    deleteQuiz: builder.mutation<string, string>({
      query: (id) => ({ url: `quizzes/${id}`, method: "DELETE" }),
      invalidatesTags: ["User", "Quiz"],
    }),

    ropcLogin: builder.mutation<void, { username: string; password: string }>({
      query: (credentials) => ({
        url: `auth/login/ropc`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User", "Quiz"],
    }),

    getAuthUser: builder.query<UserType, void>({
      query: () => "users/me",
      providesTags: ["User"],
    }),

    getUserById: builder.query<{ data: UserType }, string>({
      query: (userId) => `users/${userId}`,
      providesTags: ["ViewUser"],
    }),

    followUser: builder.mutation<string, string>({
      query: (userId) => ({ url: `users/${userId}/follow`, method: "POST" }),
      invalidatesTags: ["ViewUser", "User"],
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
      invalidatesTags: ["ResponsesCount"]
    }),

    getQuizResponseCountById: builder.query<{ count: number }, EntityId>({
      query: (quizId) => `responses/${quizId}/count`,
      providesTags: ["ResponsesCount"]
    }),

    getQuizResponsesById: builder.query<{ data: QuizResponsesResponse[] }, EntityId>({
      query: (quizId) => `responses/${quizId}`
    })
  }),
});

export default baseAPI;

export const {
  useGetQuizzesQuery,
  useGetAuthQuizzesQuery,
  useGetAuthUserQuery,
  useGetQuizByIdQuery,
  useGetUserByIdQuery,
  useFindQuizBySlugQuery,
  useGetQuizResponseCountByIdQuery,
  useGetQuizResponsesByIdQuery,

  useAddQuizMutation,
  useAddQuizResponseMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useLikeQuizMutation,
  useFollowUserMutation,
  useRopcLoginMutation,
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

interface QuizUserResponse {
  quizID: string;
  answers: object;
  meta: object;
}

interface QuizResponsesResponse {
  id: string;
  quiz: string;
  answers: object;
  createdAt: string;
  updatedAt: string;
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
  following: string[];
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  isAuth: boolean;
  id: string;
  _id: string;
}

export interface QuizType<IT = void> {
  title: string;
  id: string;
  description: string;
  image: IT extends void ? string : string | FileList;
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
  data: T[];
  count: number;
  perPage: number;
  numPages: number;
  currentPage: number;
  currentPageCount: number;
}

export type QuizListResponse = ListResponse<QuizType>;
export type NormalizedQuizListResponse = EntityState<QuizType> &
  Omit<QuizListResponse, "data">;
