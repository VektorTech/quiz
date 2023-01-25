import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";

import { QuizSchemaType } from "@/features/quiz/quizSlice";

const useQuizForm = ({
  defaultValue,
}: {
  defaultValue: QuizSchemaType | undefined;
}) => {
  const { register, handleSubmit, control, setValue } =
    useForm<QuizSchemaType>();

  const setFormValues = useCallback(
    (schema: QuizSchemaType) => {
      const { name, description, image, time, category, questions } = schema;
      setValue("name", name);
      setValue("description", description);
      setValue("image", image);
      setValue("time", time);
      setValue("category", category);
      setValue("questions", questions);
    },
    [setValue]
  );

  useEffect(() => {
    if (defaultValue) {
      setFormValues(defaultValue);
    }
  }, [defaultValue, setFormValues]);

  return { register, handleSubmit, setFormValues, control };
};

export default useQuizForm;
