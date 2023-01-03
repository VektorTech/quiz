import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import store from "@/app/store";

import Header from "./Header";

test("should verify functionality of header controls", async () => {
  render(
    <Provider store={store}>
      <Header />
    </Provider>,
    { wrapper: MemoryRouter }
  );

  await screen.findAllByPlaceholderText("Search Quizzes");
  await screen.findAllByText("Create A Quiz");

  const menuButton = await screen.findByLabelText("list categories");
  await userEvent.click(menuButton);

  expect(screen.getByRole("menu")).toHaveTextContent(/anime/i);
  expect(screen.getByRole("menu")).toHaveTextContent(/tech/i);
});
