import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import store from "@/app/store";

import Header from "./Header";

jest.mock("react-router-dom", () => {
  return jest.fn(() => ({
    useSubmitImpl: jest.fn(),
  }));
});

jest.mock("react-router-dom", () => ({
  __esModule: true,
  ...jest.requireActual("react-router-dom"),
  Form: () => {
    return <form></form>;
  },
  useNavigate: () => jest.fn(),
}));

test("should verify functionality of header controls", async () => {
  render(
    <Provider store={store}>
      <Header />
    </Provider>,
    { wrapper: MemoryRouter }
  );

  await screen.findAllByText("Create A Quiz");

  const menuButton = await screen.findByLabelText("list categories");
  await userEvent.click(menuButton);

  expect(screen.getByRole("menu")).toHaveTextContent(/anime/i);
  expect(screen.getByRole("menu")).toHaveTextContent(/tech/i);
});
