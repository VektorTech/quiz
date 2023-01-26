import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import store from "@/app/store";

import QuizCreator from "./QuizCreator";

test("renders info panel correctly", async () => {
  render(
    <Provider store={store}>
      <QuizCreator />
    </Provider>,
    { wrapper: MemoryRouter }
  );

  await screen.findAllByPlaceholderText(
    "Eg. Star Wars Quiz - Only True Fans Score 80% Or More"
  );
  await screen.findAllByPlaceholderText("About Quiz (at least 30 characters)");
  await screen.findAllByPlaceholderText("No time limit");

  const selectCategoryButton = await screen.findByText("Select Category");
  await userEvent.click(selectCategoryButton);

  expect(screen.getByText("animal")).toBeVisible();
});

test("renders questions panel correctly", async () => {
  render(
    <Provider store={store}>
      <QuizCreator />
    </Provider>,
    { wrapper: MemoryRouter }
  );

  const QuestionPanelButton = await screen.findByText("Questions");
  await userEvent.click(QuestionPanelButton);

  expect(await screen.findByText("Delete")).toBeVisible();
  expect(await screen.findByText("Select All")).toBeVisible();
  expect(await screen.findByLabelText("Add radiogroup")).toBeVisible();
});

jest.setTimeout(20 * 1000);
test("modal for tool control functions correctly", async () => {
  render(
    <Provider store={store}>
      <QuizCreator />
    </Provider>,
    { wrapper: MemoryRouter }
  );

  const QuestionPanelButton = await screen.findByText("Questions");
  await userEvent.click(QuestionPanelButton);

  const radioBtn = await screen.findByTitle("Radiogroup tool");
  await userEvent.click(radioBtn);

  const addChoiceBtn = await screen.findAllByLabelText("add choice");
  await userEvent.click(addChoiceBtn[0]);

  expect(await screen.findAllByLabelText("remove choice")).toHaveLength(3);
  expect(await screen.findByText("Add/Edit Question")).toBeInTheDocument();
});
