import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  quizzes: string[];
  likedQuizzes: string[];
  followers: string[];
  isBanned: boolean;
  isVerified: boolean;
  isAuth: boolean;
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api/",
	credentials: "include"
  }),
  endpoints: (builder) => ({
    getAuthUser: builder.query<UserType, void>({
      query: () => "users/me"
    }),
  }),
});

export const { useGetAuthUserQuery } = userApi;
