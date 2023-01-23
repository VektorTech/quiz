import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

import store from "@/app/store";

import AuthForm from "./AuthForm";
import { useAppDispatch } from "@/app/hooks";

import { openModal } from "@/features/ui/uiSlice";

const App = () => {
  const dispatch = useAppDispatch();
  dispatch(openModal("LOGIN"));
  return <AuthForm />;
};

jest.setTimeout(20 * 1000);

test("should verify AuthForm renders correctly", async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    { wrapper: MemoryRouter }
  );

  const logInButton = await screen.findByText("Log In");
  const googleButton = await screen.findByText("Continue with Google");

  const emailInput = await screen.findByLabelText("Email");
  const passwordInput = await screen.findByLabelText("Password");
  await userEvent.clear(emailInput);
  await userEvent.clear(passwordInput);

  await userEvent.click(emailInput);
  await userEvent.keyboard("email");
  await userEvent.click(passwordInput);
  await userEvent.keyboard("pass");
  await userEvent.click(emailInput);

  expect(await screen.findByText("Invalid email address")).toBeVisible();
  expect(
    await screen.findByText("Must be at least 7 characters")
  ).toBeVisible();

  expect(logInButton).toBeVisible();
  expect(googleButton).toBeVisible();
});
