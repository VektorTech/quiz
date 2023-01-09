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

import { CATEGORIES } from "@/libs/constants";

import {
  QuizSchemaType,
} from "@/features/quiz/quizSlice";

const InfoPanel = (
  ({
    register,
  }: {
    register: UseFormRegister<Omit<QuizSchemaType, "questions">>;
  }) => {
    return (
      <TabPanel>
        <VStack alignItems="flex-start" gap="2">
          <FormControl>
            <FormLabel>Quiz Name</FormLabel>
            <Input
              {...register("name")}
              placeholder="Eg. Star Wars Quiz - Only True Fans Score 80% Or More"
            />
            <FormHelperText>Title of this quiz</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register("description")}
              maxLength={1000}
              placeholder="About Quiz"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Select Image</FormLabel>
            <input
              type="file"
              id=""
              accept="image/*"
              placeholder="Upload Preview Image"
              // {...register("image")}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Quiz Timer</FormLabel>
            <NumberInput step={5} min={5} max={60}>
              <NumberInputField
                {...register("time", { valueAsNumber: true })}
                placeholder="No time limit"
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormHelperText>
              Specify quiz time limit in minutes. Ranges between 5 - 60 mins.
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Primary Category</FormLabel>
            <Select {...register("category")} placeholder="Select Category">
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
  }
);

export default memo(InfoPanel);