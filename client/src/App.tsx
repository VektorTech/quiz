import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { Helmet } from "react-helmet-async";

import Home from "@/routes/Home";
import Browse from "@/routes/Browse";
import NotFound from "@/routes/NotFound";
import Quiz from "@/routes/Quiz";
import Dashboard from "@/routes/Dashboard";
import User from "@/routes/User";
import CreateQuiz from "@/routes/CreateQuiz";
import ErrorPage from "@/routes/ErrorPage";

import Layout from "@/components/Layout";
import { useGetAuthQuizzesQuery } from "./services/api";
import quizzesLoader from "./loaders/quizzesLoader";
import Profile from "./routes/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import responsesLoader from "./loaders/responsesLoader";

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
      <Route
        path="dashboard/:quizID"
        loader={responsesLoader}
        element={<ProtectedRoute component={Dashboard} />}
      />
      <Route
        path="create"
        element={<ProtectedRoute component={CreateQuiz} />}
      />
      <Route
        path="edit/:quizID"
        element={<ProtectedRoute component={CreateQuiz} />}
      />
      <Route path="me" element={<ProtectedRoute component={Profile} />} />
      <Route path="user/:userID" element={<User />} />
      <Route path=":slug" element={<Quiz />} errorElement={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  useGetAuthQuizzesQuery();

  return (
    <div className="App">
      <Helmet>
        <meta name="referrer" content="no-referrer" />
        <title>QuizWrld</title>
      </Helmet>
      <RouterProvider router={BrowserRouter} />
    </div>
  );
}

export default App;
