import { RootState } from "@/app/store";
import { CATEGORIES } from "@/libs/constants";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

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
    quizCreated: (state, action: PayloadAction<string>) => {
      quizAdapter.addOne(state, {
        id: action.payload,
        name: "",
        description: "",
        image: "",
        time: 0,
        category: "",
        questions: [],
      });
    },
    quizAdded: quizAdapter.addOne,
    quizUpdated: quizAdapter.updateOne,
    quizDeleted: quizAdapter.removeOne,
    quizzesReceived: quizAdapter.setAll,
  },
});

export const {
  quizCreated,
  quizAdded,
  quizUpdated,
  quizDeleted,
  quizzesReceived,
} = quizSlice.actions;

export const { selectById: selectQuizById, selectAll } = quizAdapter.getSelectors<RootState>(
  (state) => state.quizzes
);

export default quizSlice.reducer;
