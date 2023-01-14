import { QuizSchemaType } from "@/features/quiz/quizSlice";
import { QuizType, useAddQuizResponseMutation } from "@/services/api";
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
import { Link as RLink, useLoaderData } from "react-router-dom";

import PlaceholderImage from "@/assets/quiz-img-placeholder.png";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { StarIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Quiz() {
  const { data } = useLoaderData() as { data: QuizType };

  const schema = data.surveySchema;

  const [nextActive, setNextActive] = useState(false);
  // console.log(schema, data);
  const { handleSubmit, control } = useForm();
  const [addResponse] = useAddQuizResponseMutation();

  return (
    <Container maxW="container.lg" pt="40px">
      <HStack>
        <Image
          alt={data.title}
          objectFit="cover"
          width="130px"
          height="130px"
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
              <>
                {i ? <span>, </span> : null}
                <Link as={RLink} to="/">
                  <u>{tag}</u>
                </Link>
              </>
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
          <StarIcon boxSize={5} color="orange.300" />
          <Text>{data.likes}</Text>
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

      <Slider
        infinite={false}
        draggable={false}
        afterChange={() => setNextActive(false)}
        prevArrow={<HiddenButton />}
        nextArrow={
          <NextArrow
            disabled={!nextActive}
            onSubmit={handleSubmit((formData) => {
              let points = 0;
              schema.questions.forEach((question) => {
                points += Number(formData[question.id] === question.answer);
              });
              const responses = schema.questions.reduce<Record<string, string>>(
                (obj, current) => {
                  obj[current.question] = formData[current.id];
                  return obj;
                },
                {}
              );
              addResponse({
                quizID: data.id,
                answers: responses,
                meta: { score: points },
              });
            })}
          />
        }
      >
        {schema.questions.map((question, i) => (
          <Stack key={question.id}>
            <Heading fontSize="lg" as="h3">
              {i+1}.&nbsp;{question.question}
            </Heading>
            <Controller
              name={question.question}
              control={control}
              render={({ field: { onChange, value } }) => (
                <RadioGroup
                  value={value}
                  onChange={(nextValue) => {
                    setNextActive(true);
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
    </Container>
  );
}

const HiddenButton = (props: unknown) => <button hidden />;

function NextArrow(
  props: Partial<{
    onClick: () => void;
    onSubmit: (args: any) => void;
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
