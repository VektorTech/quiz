import { QuizType } from "@/services/api";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import QuizCard from "./QuizCard";

test("should verify card renders correctly", async () => {
  render(
    <QuizCard
      quiz={
        {
          id: "random-quiz-id",
          title: "Test Quiz Title",
          description: "Test Quiz Description",
          category: "misc",
          slug: "test-quiz",
        } as QuizType
      }
    />,
    { wrapper: MemoryRouter }
  );

  const title = await screen.findByText("Test Quiz Title");
  const description = await screen.findByText("Test Quiz Description");
  const category = await screen.findByText("misc");

  expect(title).toBeVisible();
  expect(description).toBeVisible();
  expect(category).toBeVisible();
});
