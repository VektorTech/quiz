import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

import Home from "@/routes/Home";
import Browse from "@/routes/Browse";
import NotFound from "@/routes/NotFound";
import Quiz from "@/routes/Quiz";
import Dashboard from "@/routes/Dashboard";
import User from "@/routes/User";
import CreateQuiz from "@/routes/CreateQuiz";
import ErrorPage from "@/routes/ErrorPage";

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
        path=":slug"
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
