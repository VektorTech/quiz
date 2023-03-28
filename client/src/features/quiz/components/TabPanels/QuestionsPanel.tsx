import { useState, useId, FC } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  TabPanel,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import { DraggableDataList } from "@/components/DraggableDataList";
import Radiogroup from "../Tools/Radiogroup";

import { QuestionType, QuizSchemaType } from "@/features/quiz/quizSlice";
import RadioButtonIcon from "@/components/Icons/RadioButtonIcon";
import { Control, useController } from "react-hook-form";

const QuestionPanel: FC<QuestionPanelProps> = ({ control }) => {
  const controller = useController({ name: "questions", control });

  const questions = controller.field.value ?? [];
  const setQuestions = (_questions: QuestionType[]) =>
    controller.field.onChange({ target: { value: _questions } });

  const selectAllId = useId();

  const [activeQuestion, setActiveQuestion] = useState<number>(-1);
  const [currentControl, setCurrentControl] = useState<"radiogroup" | null>(
    null
  );

  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const allChecked =
    !!questions.length && !!checkedItems.length && checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  const onConfirm = (details: QuestionType) => {
    if (activeQuestion > -1) {
      const newQuestions = [...questions];
      newQuestions[activeQuestion] = details;
      setQuestions(newQuestions);
      setActiveQuestion(-1);
    } else {
      setQuestions([...questions, details]);
      setCheckedItems(checkedItems.concat(false));
    }
    setCurrentControl(null);
  };

  return (
    <TabPanel>
      <Flex
        rowGap="1"
        flexDirection="row"
        justifyContent="end"
        className="actions-bar"
      >
        <HStack gap="1">
          <Button
            leftIcon={<DeleteIcon />}
            variant="outline"
            colorScheme="red"
            onClick={() => {
              const _questions = questions.filter((_, i) => {
                return !checkedItems[i];
              });
              setQuestions(_questions);
              setCheckedItems(Array(_questions.length).fill(false));
            }}
          >
            Delete
          </Button>

          <Flex>
            <Text as="label" cursor="pointer" htmlFor={selectAllId}>
              Select All
            </Text>
            <Checkbox
              pl="2"
              id={selectAllId}
              isChecked={allChecked}
              isIndeterminate={isIndeterminate}
              onChange={({ target }) =>
                setCheckedItems(Array(questions.length).fill(target.checked))
              }
            />
          </Flex>
        </HStack>
      </Flex>

      <Flex pt="5" gap="5" minH="200">
        <VStack flexBasis="32px" className="toolbar">
          <Tooltip label="Add Radiogroup">
            <IconButton
              size="sm"
              variant="outline"
              borderRadius={0}
              title="Radiogroup tool"
              aria-label="Add radiogroup"
              onClick={() => {
                setActiveQuestion(-1);
                setCurrentControl("radiogroup");
              }}
              icon={<RadioButtonIcon boxSize="5" />}
            />
          </Tooltip>
        </VStack>

        <Box
          borderTop={"1px solid"}
          borderColor="gray.200"
          flexGrow="1"
          className="questions"
        >
          <DraggableDataList
            data={questions}
            keyExtractor={(item) => item.id}
            onDragEnd={(items) => {
              setCheckedItems(
                items.map((item) => {
                  const qIndex = questions.findIndex(
                    (question) => item.id === question.id
                  );
                  return checkedItems[qIndex];
                })
              );
              setQuestions(items);
            }}
            renderItem={(data, index) => (
              <HStack alignItems={"stretch"}>
                <Box
                  _hover={{ bg: "#F5F5F5" }}
                  transition="background-color 0.3s"
                  width="100%"
                  pl="2"
                  m="0"
                  borderRadius="2px"
                  cursor="pointer"
                  onClick={() => {
                    setActiveQuestion(index);
                    setCurrentControl("radiogroup");
                  }}
                >
                  <span>{`${index + 1}. `}</span>
                  {data.question}
                </Box>
                <Checkbox
                  onChange={({ target }) => {
                    const _tempCheckedItems = [...checkedItems];
                    _tempCheckedItems[index] = target.checked;
                    setCheckedItems(_tempCheckedItems);
                  }}
                  isChecked={!!checkedItems[index]}
                />
              </HStack>
            )}
          />
        </Box>
      </Flex>

      <Radiogroup
        onConfirm={onConfirm}
        onClose={() => setCurrentControl(null)}
        isOpen={currentControl === "radiogroup"}
        preset={questions[activeQuestion]}
      />
    </TabPanel>
  );
};

export default QuestionPanel;

interface QuestionPanelProps {
  control: Control<QuizSchemaType, any>;
}
