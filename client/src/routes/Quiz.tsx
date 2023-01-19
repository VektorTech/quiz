import {
  QuizType,
  useAddQuizResponseMutation,
  useFindQuizBySlugQuery,
  useGetAuthUserQuery,
  useLikeQuizMutation,
} from "@/services/api";
import {
  Button,
  Container,
  Divider,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
  HStack,
  Link,
  Image,
  Box,
  Badge,
} from "@chakra-ui/react";
import { Link as RLink, useLoaderData, useParams } from "react-router-dom";
import { Fragment, useRef } from "react";
import PlaceholderImage from "@/assets/images/quiz-img-placeholder.jpg";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { ChevronLeftIcon, StarIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

export default function Quiz() {
  // const { data } = useLoaderData() as { data: QuizType };
  const { slug } = useParams();
  const { data: quiz, error } = useFindQuizBySlugQuery(slug || "");
  const data = quiz?.data;

  if (!data) {
    throw error;
  }

  const schema = data.surveySchema;
  const [results, setResults] = useState<{
    answers: Record<string, string>[];
    meta: any;
  }>();
  const { handleSubmit, control, watch } = useForm();
  const [addResponse] = useAddQuizResponseMutation();
  const { data: user } = useGetAuthUserQuery();
  const quizLiked = user?.likedQuizzes.some((quiz) => quiz.id === data.id);
  const [likeQuiz] = useLikeQuizMutation();

  const [slideIndex, setSlideIndex] = useState(0);
  const formValues = watch();
  const sliderRef = useRef<Slider>(null);

  return (
    <Container maxW="container.lg" pt="40px">
      <Helmet>
        <title>Quiz | {data.title}</title>
      </Helmet>
      <HStack gap="2">
        <Image
          alt={data.title}
          objectFit="cover"
          width="140px"
          height="140px"
          display={{ base: "none", sm: "block" }}
          src={data.image ?? PlaceholderImage}
        />
        <Box>
          <Heading as="h1" fontSize={{ base: "24", sm: "28", md: "36" }}>
            {data.title}
          </Heading>
          <Text>
            By&nbsp;
            <Link as={RLink} to={`/user/${data.createdBy._id}`}>
              <strong>{data.createdBy.avatar.username}</strong>
            </Link>
          </Text>

          <Box mt="3">
            <Badge>
              <RLink to={`/browse/${data.category}`}>{data.category}</RLink>
            </Badge>
            {!!data.tags.length && " | Tags: "}
            {data.tags.map((tag, i) => (
              <Fragment key={tag}>
                {i ? <span>, </span> : null}
                <Link as={RLink} to="/">
                  <u>{tag}</u>
                </Link>
              </Fragment>
            ))}
          </Box>
        </Box>
      </HStack>
      <Stack
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.200"
        mt="4"
        padding="10px 0"
      >
        <HStack>
          <Button
            variant="ghost"
            leftIcon={
              <StarIcon
                boxSize={5}
                color={quizLiked ? "orange.300" : "gray.300"}
              />
            }
            onClick={() => {
              if (user?.isAuth && data.status === "ACTIVE") {
                likeQuiz(data.id);
              }
            }}
            aria-label="like"
          >
            {data.likes}
          </Button>
          <Text>&bull;</Text>
          <Text fontWeight="bold">{schema.questions.length} Questions</Text>
          <Text>&bull;</Text>
          <Text fontSize="14">
            Created{" "}
            {new Intl.DateTimeFormat("en", dateFormatOptions)
              .format(new Date(data.createdAt))
              .replaceAll("/", ".")}
          </Text>
        </HStack>
      </Stack>

      <Text mt="10px">{data.description}</Text>

      <Divider mt="20px" mb="20px" />

      {results ? (
        <Stack textAlign="center">
          <Heading as="h3">
            Scored {results.meta.score} / {schema.questions.length}
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
          <Slider
            infinite={false}
            draggable={false}
            afterChange={setSlideIndex}
            prevArrow={<PrevArrow />}
            nextArrow={<HiddenButton />}
            ref={sliderRef}
          >
            {schema.questions.map((question, i) => (
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
            onClick={sliderRef.current?.slickNext}
            currentSlide={slideIndex}
            slideCount={schema.questions.length}
            disabled={!formValues[schema.questions[slideIndex].id]}
            onSubmit={handleSubmit((formData) => {
              let score = 0;
              let corrections: Record<string, string>[] = [];
              const responses = schema.questions.reduce<Record<string, string>>(
                (obj, current) => {
                  obj[current.question] = formData[current.id];
                  const correct = Number(
                    formData[current.id] === current.answer
                  );
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
              if (data.status === "ACTIVE") {
                addResponse({
                  quizID: data.id,
                  answers: responses,
                  meta: { score },
                });
              }
              setResults({ answers: corrections, meta: { score } });
            })}
          />
        </>
      )}
    </Container>
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
  }>
) {
  const { onClick, onSubmit, currentSlide, slideCount, disabled } = props;
  const isFinal = currentSlide === (slideCount || 0) - 1;
  return (
    <Button
      disabled={!!disabled}
      colorScheme={isFinal ? "green" : "gray"}
      onClick={isFinal ? onSubmit : onClick}
      float="right"
    >
      {isFinal ? "Done" : "Next"}
    </Button>
  );
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
};
