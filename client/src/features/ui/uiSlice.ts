import { RootState } from "@/app/store";
import baseAPI from "@/services/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type modalState = "LOGIN" | null;
const initialState: {
  modal: modalState;
} = {
  modal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<modalState>) => {
      state.modal = action.payload;
    },
    closeModal: (state) => {
      state.modal = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(baseAPI.endpoints.ropcLogin.matchFulfilled, (state) => {
      state.modal = null;
    });
  },
});

export const selectModalState = (state: RootState) => state.uiState.modal;

export const { closeModal, openModal } = uiSlice.actions;

export default uiSlice.reducer;
