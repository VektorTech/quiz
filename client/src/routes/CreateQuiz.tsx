import { QuizCreator } from "@/components/QuizCreator";
import { useGetAuthUserQuery } from "@/services/api";
import { Navigate, useParams } from "react-router-dom";

export default function CreateQuizPage() {
  const { quizID } = useParams();
  const { data } = useGetAuthUserQuery();

  if (data?.isAuth) {
    if (quizID && !data.quizzes.some((quiz) => quiz.id === quizID)) {
      return <Navigate to="/" />
    }
    return (
      <div>
        <QuizCreator id={quizID} />
      </div>
    );
  }
  return <Navigate to="/" />;
}
