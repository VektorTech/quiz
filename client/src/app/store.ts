import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

import quizReducer from "@/features/quiz/quizSlice";
import uiReducer from "@/features/ui/uiSlice";
import baseAPI from "@/services/api";

const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    quizzes: quizReducer,
    uiState: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
