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

import { DraggableDataList } from "../../DraggableDataList";
import Radiogroup from "../Tools/Radiogroup";

import { QuestionType } from "@/features/quiz/quizSlice";
import RadioButtonIcon from "@/components/Icons/RadioButtonIcon";

const QuestionPanel: FC<QuestionPanelProps> = ({ questions, setQuestions }) => {
  const selectAllId = useId();
  const [activeQuestion, setActiveQuestion] = useState<number>(-1);
  const [currentControl, setCurrentControl] = useState<string>("");
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
    setCurrentControl("");
  };

  return (
    <TabPanel>
      <Flex
        rowGap="1"
        flexDirection={{ base: "column", sm: "row" }}
        justifyContent="space-between"
        className="actions-bar"
      >
        <Box>
          {/* <Button leftIcon={<DownloadIcon transform="rotate(180deg)" />}>
			  Import Schema
			</Button> */}
        </Box>
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

      <Flex pt="5" gap="5">
        <VStack flexBasis="32px" className="toolbar">
          <Tooltip label="Add Radiogroup">
            <IconButton
              size="sm"
              variant="outline"
              borderRadius={0}
              colorScheme={"green"}
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
                items.map((item, index) => {
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
                <span>{`${index + 1}. `}</span>
                <Box
                  width="100%"
                  onClick={() => {
                    setActiveQuestion(index);
                    setCurrentControl("radiogroup");
                  }}
                >
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
        onClose={() => setCurrentControl("")}
        isOpen={currentControl === "radiogroup"}
        preset={questions[activeQuestion]}
      />
    </TabPanel>
  );
};

export default QuestionPanel;

interface QuestionPanelProps {
  questions: QuestionType[];
  setQuestions: (questions: QuestionType[]) => void;
}
