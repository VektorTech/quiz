import { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Controller, useForm } from "react-hook-form";
import prettyMilliseconds from "pretty-ms";

import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

import { QuizSchemaType } from "@/features/quiz/quizSlice";
import useInterval from "@/hooks/useInterval";

export default function QuizRenderer({
  quizSchema,
  onQuizComplete,
}: {
  quizSchema: QuizSchemaType;
  onQuizComplete: (res: {
    answers: Record<string, string>;
    meta: { score: number };
  }) => void;
}) {
  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = useForm();

  const [results, setResults] = useState<{
    answers: Record<string, string>[];
    meta: { score: number };
  }>();
  const [quizStart, setQuizStart] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const formValues = watch();
  const sliderRef = useRef<Slider>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const submitQuiz = useCallback(
    handleSubmit((formData) => {
      let score = 0;
      let corrections: Record<string, string>[] = [];
      const responses = quizSchema.questions.reduce<Record<string, string>>(
        (obj, current) => {
          obj[current.question] = formData[current.id];
          const correct = !!current.answer ? Number(formData[current.id] === current.answer) : 1;
          score += correct;
          if (!correct) {
            corrections.push({
              question: current.question,
              answer: current.answer,
              choice: formData[current.id],
            });
          }
          return obj;
        },
        {}
      );
      onQuizComplete({
        answers: responses,
        meta: { score },
      });
      setResults({ answers: corrections, meta: { score } });
    }),
    [onQuizComplete, quizSchema.questions]
  );

  if (!quizStart) {
    return (
      <Stack maxW="300px" m="auto" textAlign="center">
        <Button colorScheme="green" onClick={() => setQuizStart(true)}>
          Start Quiz
        </Button>
        <Text fontSize="lg" fontWeight="bold">
          {quizSchema.time ? `${quizSchema.time} mins` : "No time limit"}
        </Text>
      </Stack>
    );
  }

  return results ? (
    <Stack textAlign="center">
      <Heading as="h3">
        Scored {results.meta.score} / {quizSchema.questions.length}
      </Heading>
      {results.answers.map((answer) => (
        <Box key={answer.choice + answer.answer} pt="5">
          <Heading fontSize="lg" as="h2">
            {answer.question}
          </Heading>
          <Text mt="2" color="green">
            {answer.answer}
          </Text>
          <Text color="red.400">
            <del>{answer.choice}</del>
          </Text>
        </Box>
      ))}
    </Stack>
  ) : (
    <>
      {quizSchema.time ? (
        <CountDown
          time={Number(quizSchema.time) * 1000 * 60}
          onComplete={submitQuiz}
        />
      ) : null}
      <Slider
        infinite={false}
        draggable={false}
        afterChange={setSlideIndex}
        prevArrow={<PrevArrow />}
        nextArrow={<HiddenButton />}
        ref={sliderRef}
      >
        {quizSchema.questions.map((question, i) => (
          <Stack key={question.id}>
            <Heading fontSize="lg" as="h2">
              {i + 1}.&nbsp;{question.question}
            </Heading>
            <Controller
              name={question.id}
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  value={value}
                  onChange={(nextValue) => {
                    onChange(nextValue);
                  }}
                >
                  <VStack alignItems="flex-start" pl="2">
                    {question.choices.map((choice) => (
                      <Radio value={choice.text} key={choice.id}>
                        {choice.text}
                      </Radio>
                    ))}
                  </VStack>
                </RadioGroup>
              )}
            />
          </Stack>
        ))}
      </Slider>

      <NextArrow
        isLoading={isSubmitting}
        onClick={sliderRef.current?.slickNext}
        currentSlide={slideIndex}
        slideCount={quizSchema.questions.length}
        disabled={!formValues[quizSchema.questions[slideIndex].id]}
        onSubmit={submitQuiz}
      />
    </>
  );
}

const HiddenButton = () => <button hidden />;

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <Button
    mb="5"
    variant="outline"
    onClick={onClick}
    leftIcon={<ChevronLeftIcon />}
  >
    Previous
  </Button>
);

function NextArrow(
  props: Partial<{
    onClick: () => void;
    onSubmit: () => void;
    currentSlide: number;
    slideCount: number;
    disabled: boolean;
    isLoading: boolean;
  }>
) {
  const { onClick, onSubmit, currentSlide, slideCount, disabled, isLoading } =
    props;
  const isFinal = currentSlide === (slideCount || 0) - 1;
  return (
    <Button
      isLoading={isLoading}
      disabled={!!disabled}
      colorScheme={isFinal ? "green" : "gray"}
      onClick={isFinal ? onSubmit : onClick}
      float="right"
    >
      {isFinal ? "Done" : "Next"}
    </Button>
  );
}

const CountDown = ({
  time,
  onComplete,
}: {
  time: number;
  onComplete: () => void;
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [delay, setDelay] = useState<number | null>(1000);

  useEffect(() => {
    if (elapsed === time) {
      setDelay(null);
      onComplete();
    }
  }, [onComplete, elapsed, time]);

  useInterval(() => {
    setElapsed((elapsed) => elapsed + 1000);
  }, delay);

  return (
    <Box width="20" height="20" m="auto" mb="2" color="brand.500">
      <CircularProgressbar
        strokeWidth={5}
        styles={buildStyles({
          pathColor: "currentColor",
          textColor: "currentColor",
          textSize: "25px",
        })}
        value={100 - (elapsed / time) * 100}
        text={`${prettyMilliseconds(time - elapsed, { colonNotation: true })}`}
      />
    </Box>
  );
};
