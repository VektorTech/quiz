import { QuizCreator } from "@/components/QuizCreator";
import { UserType } from "@/services/api";
import { Helmet } from "react-helmet-async";
import { Navigate, useParams } from "react-router-dom";

export default function CreateQuizPage({ user }: { user: UserType }) {
  const { quizID } = useParams();

  if (quizID && !user.quizzes.some((quiz) => quiz.id === quizID)) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <Helmet>
        <title>Create Quiz</title>
      </Helmet>
      <QuizCreator id={quizID} />
    </div>
  );
}
