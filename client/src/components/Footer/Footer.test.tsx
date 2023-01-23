import { render, screen } from "@testing-library/react";

import Footer from "./Footer";

test("should verify footer renders correctly", async () => {
  render(<Footer />);

  const copyText = await screen.findByText(
    `© ${new Date().getFullYear()} QuizWrld. All Rights Reserved.`
  );
  const devText = await screen.findByText("Developed by Kenny Sutherland.");

  expect(copyText).toBeVisible();
  expect(devText).toBeVisible();
});
