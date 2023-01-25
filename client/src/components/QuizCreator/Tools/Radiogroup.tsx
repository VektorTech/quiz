import { useState, useLayoutEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Radio,
  RadioGroup,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { DraggableDataList } from "@/components/DraggableDataList";
import { SmallAddIcon, SmallCloseIcon } from "@chakra-ui/icons";

import QuestionEditBox from "../QuestionEditBox";
import { nanoid } from "@reduxjs/toolkit";
import { toBase62 } from "@/utils";
import { QuestionType } from "@/features/quiz/quizSlice";

const getChoiceObj = () => ({
  id: nanoid(5),
  text: "",
});

const Radiogroup = ({
  preset,
  isOpen = false,
  onClose,
  onConfirm,
}: {
  preset?: QuestionType;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: QuestionType) => void;
}) => {
  const [choices, setChoices] = useState<
    {
      id: string;
      text: string;
    }[]
  >([]);
  const [answer, setAnswer] = useState("");
  const [questionText, setQuestionText] = useState("");

  useLayoutEffect(() => {
    if (preset) {
      setChoices(preset.choices);
      setAnswer(preset.answer);
      setQuestionText(preset.question);
    } else {
      setChoices([getChoiceObj(), getChoiceObj()]);
      setAnswer("");
      setQuestionText("");
    }
  }, [preset, isOpen]);

  return (
    <QuestionEditBox
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={() =>
        onConfirm({
          type: "radio",
          answer,
          choices,
          question: questionText,
          id: toBase62(questionText),
        })
      }
    >
      <VStack alignItems="flex-start" gap="2">
        <FormControl>
          <FormLabel>Question</FormLabel>
          <Input
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Eg. Who was the voice actor of Darth Vader?"
          />
        </FormControl>

        <Box w="100%">
          <RadioGroup onChange={setAnswer} defaultValue={preset?.answer}>
            <DraggableDataList
              data={choices}
              onDragEnd={(items) => setChoices(items)}
              keyExtractor={(item) => item.id}
              renderItem={(data, index) => (
                <HStack w="100%">
                  <IconButton
                    size="sm"
                    aria-label="add choice"
                    variant="outline"
                    icon={<SmallAddIcon />}
                    onClick={() => {
                      const newChoices = [...choices];
                      newChoices.splice(index + 1, 0, getChoiceObj());
                      setChoices(newChoices);
                    }}
                  />
                  {choices.length > 2 ? (
                    <IconButton
                      size="sm"
                      aria-label="remove choice"
                      variant="outline"
                      icon={<SmallCloseIcon />}
                      onClick={() => {
                        setChoices(choices.filter((_, i) => i !== index));
                      }}
                    />
                  ) : null}
                  <Input
                    size="sm"
                    onChange={(e) => {
                      const newChoices = JSON.parse(JSON.stringify(choices));
                      newChoices[index].text = e.target.value;
                      setChoices(newChoices);
                    }}
                    value={data.text}
                    placeholder={`Choice #${index + 1}`}
                  />
                  <Radio
                    value={data.text || index.toString()}
                    name="radio-answer"
                  />
                </HStack>
              )}
            />
          </RadioGroup>
        </Box>
      </VStack>
    </QuestionEditBox>
  );
};

export default Radiogroup;
