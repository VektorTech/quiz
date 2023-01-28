import { forwardRef, useImperativeHandle } from "react";
import {
  Button,
  Container,
  Heading,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { QuizSchemaType, selectQuizById } from "@/features/quiz/quizSlice";

import InfoPanel from "./TabPanels/InfoPanel";
import QuestionPanel from "./TabPanels/QuestionsPanel";

import SaveIcon from "@/components/Icons/SaveIcon";
import { useAddQuizMutation, useUpdateQuizMutation } from "@/services/api";
import { useAppSelector } from "@/app/hooks";
import { verifyFBQError } from "@/utils";
import useQuizForm from "@/hooks/useQuizForm";

export default forwardRef<
  { getCreatorState: Function; setCreatorState: Function },
  { id?: string }
>(function CreateQuiz({ id = "" }, fRef) {
  const quizSchema = useAppSelector((state) => selectQuizById(state, id));
  const toast = useToast();

  const [addQuiz] = useAddQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();

  const navigate = useNavigate();

  const { register, handleSubmit, setFormValues, control } = useQuizForm({
    defaultValue: quizSchema,
  });

  const saveHandler = handleSubmit(async (_quizSchema) => {
    try {
      toast({
        title: "Processing...",
        status: "loading",
        duration: 1000,
      });
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
    } catch (error: unknown) {
      if (verifyFBQError(error))
        toast({
          title: "Something went wrong.",
          description: error.error?.toString() || error.data?.message,
          status: "error",
          duration: 3000,
        });
    }
  });

  useImperativeHandle(fRef, () => ({
    getCreatorState: (callback: SubmitHandler<QuizSchemaType>) =>
      handleSubmit(callback),
    setCreatorState: (state: QuizSchemaType) => setFormValues(state),
  }));

  return (
    <>
      <Container maxW="container.lg">
        <Heading textAlign="center" my="3">
          {quizSchema?.id ? "Update" : "Create"} Quiz
        </Heading>
      </Container>

      <Container maxW="container.md">
        <Tabs>
          <TabList>
            <Tab>Info</Tab>
            <Tab>Questions</Tab>
          </TabList>

          <TabPanels>
            <InfoPanel register={register} />
            <QuestionPanel control={control} />
          </TabPanels>

          <HStack pr="4">
            <Button
              variant="outline"
              height="8"
              lineHeight="8"
              ml="auto"
              mr="1"
              onClick={() => navigate("..")}
            >
              Cancel
            </Button>
            <Button
              leftIcon={<SaveIcon />}
              colorScheme="green"
              height="8"
              lineHeight="8"
              onClick={saveHandler}
            >
              Save
            </Button>
          </HStack>
        </Tabs>
      </Container>
    </>
  );
});
