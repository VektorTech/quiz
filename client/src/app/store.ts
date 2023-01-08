import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { quizApi } from "@/services/quiz";
import { userApi } from "@/services/user";
import quizReducer from "@/features/quiz/quizSlice";

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [quizApi.reducerPath]: quizApi.reducer,
    quizzes: quizReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware, quizApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
