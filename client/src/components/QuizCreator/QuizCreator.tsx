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

import { useAppDispatch } from "@/app/hooks";

import {
  QuestionType,
  quizAdded,
  QuizSchemaType,
} from "@/features/quiz/quizSlice";
import InfoPanel from "./TabPanels/InfoPanel";
import QuestionPanel from "./TabPanels/QuestionsPanel";

export default function CreateQuiz() {
  const dispatch = useAppDispatch();

  const { register, handleSubmit } =
    useForm<Omit<QuizSchemaType, "questions">>();
  const [questions, setQuestions] = useState<QuestionType[]>([]);

  const saveHandler = handleSubmit((data) => {
    const quizSchema = { ...data, questions, time: data.time || 0 };
    dispatch(quizAdded(quizSchema));
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
