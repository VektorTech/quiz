import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Helmet } from 'react-helmet-async';

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
import quizzesLoader from "./loaders/quizzes.loader";
import Profile from "./routes/Profile";

export const BrowserRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Home />} />
      <Route path="browse">
        <Route loader={quizzesLoader} index element={<Browse />} />
        <Route
          errorElement={<NotFound />}
          loader={quizzesLoader}
          path=":categoryID"
          element={<Browse />}
        />
      </Route>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="create" element={<CreateQuiz />} />
      <Route path="edit/:quizID" element={<CreateQuiz />} />
      <Route path="me" element={<User />} />
      <Route path="user/:userID" element={<Profile />} />
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
      <Helmet>
        <meta name="referrer" content="no-referrer" />
      </Helmet>
      <RouterProvider router={BrowserRouter} />
    </div>
  );
}

export default App;
