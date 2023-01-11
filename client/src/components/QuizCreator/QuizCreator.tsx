import { useState } from "react";
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

import { QuestionType, QuizSchemaType } from "@/features/quiz/quizSlice";

import InfoPanel from "./TabPanels/InfoPanel";
import QuestionPanel from "./TabPanels/QuestionsPanel";
import { useAddQuizMutation } from "@/services/api";

export default function CreateQuiz() {
  const [addQuiz] = useAddQuizMutation();
  const navigate = useNavigate();

  const { register, handleSubmit } =
    useForm<Omit<QuizSchemaType, "questions">>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const saveHandler = handleSubmit(async (data) => {
    const quizSchema = { ...data, questions, time: data.time || 0 };

    try {
      await addQuiz(quizSchema).unwrap();
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
        <Tabs colorScheme={"purple"}>
          <TabList>
            <Tab>Info</Tab>
            <Tab>Questions</Tab>
            <Button
              colorScheme={"green"}
              borderRadius={0}
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
