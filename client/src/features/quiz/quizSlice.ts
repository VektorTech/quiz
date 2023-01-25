import { RootState } from "@/app/store";
import { CATEGORIES } from "@/utils/constants";
import baseAPI from "@/services/api";

import {
  createEntityAdapter,
  createSlice,
  EntityId,
  nanoid,
} from "@reduxjs/toolkit";

export interface QuestionType {
  type: "radio";
  answer: string;
  choices: { id: string; text: string }[];
  question: string;
  id: string;
}

export interface QuizSchemaType {
  id: string | EntityId;
  name: string;
  description: string;
  image?: string | FileList;
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
      prepare: (payload: Omit<QuizSchemaType, "id">) => ({
        payload: { ...payload, id: nanoid(5) },
      }),
    },
    quizUpdated: quizAdapter.updateOne,
    quizDeleted: quizAdapter.removeOne,
    quizzesReceived: quizAdapter.setAll,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      baseAPI.endpoints.addQuiz.matchFulfilled,
      (state, { payload }) => {
        const schema = payload.data.surveySchema;
        quizAdapter.addOne(state, { ...schema, id: nanoid(5) });
      }
    );
    builder.addMatcher(
      baseAPI.endpoints.getAuthQuizzes.matchFulfilled,
      (state, { payload }) => {
        quizAdapter.setAll(
          state,
          payload.ids.map((id) => ({
            ...(payload.entities[id]?.surveySchema ?? ({} as QuizSchemaType)),
            id,
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
