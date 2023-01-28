import {
  Button,
  Container,
  Divider,
  Heading,
  Stack,
  Text,
  HStack,
  Link,
  Image,
  Box,
  Badge,
  Tag,
} from "@chakra-ui/react";
import { Link as RLink, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { StarIcon } from "@chakra-ui/icons";
import { skipToken } from "@reduxjs/toolkit/dist/query";

import PlaceholderImage from "@/assets/images/quiz-img-placeholder.jpg";

import { getDateFormatted } from "@/utils/i18n";
import { QuizRenderer } from "@/components/QuizRenderer";
import {
  useFindQuizBySlugQuery,
  useGetAuthUserQuery,
  useLikeQuizMutation,
  useAddQuizResponseMutation,
  useGetQuizResponseCountByIdQuery,
} from "@/services/api";
import { PageSpinner } from "@/components/PageSpinner";

export default function Quiz() {
  const { slug } = useParams();
  const { data, error, isLoading, isError } = useFindQuizBySlugQuery(
    slug || ""
  );
  const quiz = data?.data;
  const { data: user } = useGetAuthUserQuery();
  const [submitResponse] = useAddQuizResponseMutation();
  const [likeQuiz] = useLikeQuizMutation();

  const { data: responseCount } = useGetQuizResponseCountByIdQuery(
    quiz?.id ?? skipToken
  );

  if (isLoading) {
    return <PageSpinner />;
  }

  if (!quiz || isError) {
    throw error;
  }

  const { surveySchema } = quiz;
  const quizLiked = user?.likedQuizzes.some(({ id }) => id === quiz.id);

  return (
    <Container maxW="container.lg" pt="10">
      <Helmet>
        <title>Quiz | {quiz.title}</title>
      </Helmet>
      <HStack gap="2" alignItems="start">
        <Image
          alt={quiz.title}
          objectFit="cover"
          width="140px"
          height="140px"
          display={{ base: "none", sm: "block" }}
          src={quiz.image || PlaceholderImage}
        />
        <Box pt="2">
          <Heading as="h1" fontSize={{ base: "24", sm: "28", md: "34" }}>
            {quiz.title}
          </Heading>
          <Text>
            By&nbsp;
            <Link as={RLink} to={`/user/${quiz.createdBy._id}`}>
              <strong>{quiz.createdBy.avatar.username}</strong>
            </Link>
          </Text>

          <Box mt="3">
            <Badge>
              <RLink to={`/browse/${quiz.category}`}>{quiz.category}</RLink>
            </Badge>
            <HStack spacing="3">
              {quiz.tags.map((tag, i) => (
                <Link key={tag} as={RLink} to="/">
                  <Tag size="sm" borderRadius="full" variant="solid">
                    {tag}
                  </Tag>
                </Link>
              ))}
            </HStack>
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
              if (user?.isAuth && quiz.status === "ACTIVE") {
                likeQuiz(quiz.id);
              }
            }}
            aria-label="like"
          >
            {quiz.likes}
          </Button>
          <Text fontSize="14">{surveySchema.questions.length} Questions</Text>
          <Text>&bull;</Text>
          <Text fontSize="14">
            Created{" "}
            {getDateFormatted(quiz.createdAt, "numeric").replaceAll("/", ".")}
          </Text>
          <Text>&bull;</Text>
          <Text fontSize="14">
            {typeof responseCount?.count == "number" &&
              `${responseCount.count} Plays`}
          </Text>
        </HStack>
      </Stack>

      <Text mt="10px">{quiz.description}</Text>

      <Divider my="20px" />

      <QuizRenderer
        quizSchema={surveySchema}
        onQuizComplete={(results) => {
          if (quiz.status === "ACTIVE")
            submitResponse({ ...results, quizID: quiz.id });
        }}
      />
    </Container>
  );
}
