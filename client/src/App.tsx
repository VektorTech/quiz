import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import NotFound from "@/pages/NotFound";
import Quiz from "@/pages/Quiz";
import Dashboard from "@/pages/Dashboard";
import User from "@/pages/User";
import CreateQuiz from "@/pages/CreateQuiz";
import ErrorPage from "@/pages/ErrorPage";

import Layout from "@/components/Layout";
import quizLoader from "@/loaders/quiz.loader";
import { useGetAuthQuizzesQuery } from "./services/api";

export const BrowserRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="browse">
        <Route index element={<Browse />} />
        <Route
          errorElement={<NotFound />}
          path=":categoryID"
          element={<Browse />}
        />
      </Route>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="create" element={<CreateQuiz />} />
      <Route path="me" element={<User />} />
      <Route path="user/:userID" element={<User />} />
      <Route
        path=":quizID"
        element={<Quiz />}
        errorElement={<NotFound />}
        loader={quizLoader}
      />
    </Route>
  )
);

function App() {
  useGetAuthQuizzesQuery();

  return (
    <div className="App">
      <RouterProvider router={BrowserRouter} />
    </div>
  );
}

export default App;
