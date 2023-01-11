import { RootState } from "@/app/store";
import { CATEGORIES } from "@/libs/constants";
import baseAPI from "@/services/api";

import { createEntityAdapter, createSlice, nanoid } from "@reduxjs/toolkit";

export interface QuestionType {
  type: "radio";
  answer: string;
  choices: any[];
  question: string;
  id: string;
}

export interface QuizSchemaType {
  id: string;
  name: string;
  description: string;
  image?: string;
  time: number;
  category: typeof CATEGORIES[number] | "";
  questions: QuestionType[];
}

const quizAdapter = createEntityAdapter<QuizSchemaType>({
  sortComparer: (quizA, quizB) => quizA.name.localeCompare(quizB.name),
});
const initialState = quizAdapter.getInitialState();

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    quizAdded: {
      reducer: quizAdapter.addOne,
      prepare: (payload) => ({ payload: { id: nanoid(5), ...payload } }),
    },
    quizUpdated: quizAdapter.updateOne,
    quizDeleted: quizAdapter.removeOne,
    quizzesReceived: quizAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      baseAPI.endpoints.addQuiz.matchFulfilled,
      (state, { payload }) => {
        const schema = JSON.parse(payload.data.surveySchema);
        quizAdapter.addOne(state, { id: nanoid(5), ...schema });
      }
    );
    builder.addMatcher(
      baseAPI.endpoints.getAuthQuizzes.matchFulfilled,
      (state, { payload }) => {
        quizAdapter.setAll(
          state,
          payload.ids.map((id) => ({
            id,
            ...JSON.parse(payload.entities[id]?.surveySchema ?? ""),
          }))
        );
      }
    );
  },
});

export const { quizAdded, quizUpdated, quizDeleted, quizzesReceived } =
  quizSlice.actions;

export const { selectById: selectQuizById, selectAll: selectAllQuizzes } =
  quizAdapter.getSelectors<RootState>((state) => state.quizzes);

export default quizSlice.reducer;
