import { memo } from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberInput,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  Select,
  TabPanel,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { UseFormRegister } from "react-hook-form";

import { CATEGORIES } from "@/utils/constants";

import { QuizSchemaType } from "@/features/quiz/quizSlice";
import { FileDropZone } from "@/components/FileDropZone";

const InfoPanel = ({
  register,
}: {
  register: UseFormRegister<QuizSchemaType>;
}) => {
  return (
    <TabPanel>
      <VStack alignItems="flex-start" gap="2">
        <FormControl>
          <FormLabel>Quiz Name</FormLabel>
          <Input
            {...register("name", { required: true, maxLength: 60 })}
            placeholder="Eg. Star Wars Quiz - Only True Fans Score 80% Or More"
          />
          <FormHelperText>Title of this quiz</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            {...register("description", { required: true, minLength: 30 })}
            maxLength={1000}
            placeholder="About Quiz (at least 30 characters)"
          />
        </FormControl>

        <FileDropZone inputProps={register("image")} />

        <FormControl>
          <FormLabel>Quiz Timer</FormLabel>
          <NumberInput maxW="15rem" step={3} min={3} max={60}>
            <NumberInputField
              {...register("time")}
              placeholder="No time limit"
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>
            Specify quiz time limit in minutes. Ranges between 3 - 60 mins.
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Primary Category</FormLabel>
          <Select
            {...register("category", { value: "misc" })}
            placeholder="Select Category"
            textTransform="capitalize"
          >
            {CATEGORIES.map((category) => (
              <option key={"option:" + category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormControl>
      </VStack>
    </TabPanel>
  );
};

export default memo(InfoPanel);
