import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Heading,
  Tab,
  Tabs,
  TabList,
  TabPanels,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  QuestionType,
  QuizSchemaType,
  selectQuizById,
} from "@/features/quiz/quizSlice";

import InfoPanel from "./TabPanels/InfoPanel";
import QuestionPanel from "./TabPanels/QuestionsPanel";
import { useAddQuizMutation, useUpdateQuizMutation } from "@/services/api";
import { useAppSelector } from "@/app/hooks";

export default function CreateQuiz({ id = "" }) {
  const quizSchema = useAppSelector((state) => selectQuizById(state, id));

  const [addQuiz] = useAddQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } =
    useForm<Omit<QuizSchemaType, "questions">>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  useEffect(() => {
    if (quizSchema) {
      const { name, description, image, time, category, questions } =
        quizSchema;
      setValue("name", name);
      setValue("description", description);
      setValue("image", image);
      setValue("time", time);
      setValue("category", category);
      setQuestions(questions);
    }
  }, [quizSchema, setValue]);

  const saveHandler = handleSubmit(async (data) => {
    const _quizSchema = { ...data, questions, time: data.time || 0 };

    try {
      if (quizSchema?.id) {
        await updateQuiz({
          id: quizSchema.id,
          title: _quizSchema.name,
          description: _quizSchema.description,
          image: _quizSchema.image,
          category: _quizSchema.category,
          surveySchema: _quizSchema,
        }).unwrap();
      } else {
        await addQuiz(_quizSchema).unwrap();
      }
      navigate("/me");
    } catch (err) {
      console.log("Error", err);
    }
  });

  return (
    <>
      <Container maxW="container.lg">
        <Heading textAlign="center" mb="3" mt="3">
          Create Quiz
        </Heading>
      </Container>

      <Container maxW="container.md">
        <Tabs>
          <TabList>
            <Tab>Info</Tab>
            <Tab>Questions</Tab>
            <Button
              colorScheme="green"
              height="8"
              lineHeight="8"
              ml="auto"
              onClick={saveHandler}
            >
              Save
            </Button>
          </TabList>

          <TabPanels>
            <InfoPanel register={register} />
            <QuestionPanel questions={questions} setQuestions={setQuestions} />
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}
