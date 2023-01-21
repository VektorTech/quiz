import { Text, Container, Grid } from "@chakra-ui/react";

import { useGetQuizzesQuery } from "@/services/api";
import { QuizCard } from "@/components/QuizCard";

export default function Home() {
  const { data } = useGetQuizzesQuery();

  if (!data) return null;

  return (
    <Container maxW="container.lg" gap="6">
      <Text mt="5">
        Welcome to the ultimate quiz site! Here, you can test your knowledge and
        challenge your friends to see who comes out on top. We have a wide
        variety of quizzes covering topics ranging from pop culture to history,
        so there's something for everyone.
      </Text>

      <Grid
        mt="10"
        templateColumns="repeat(auto-fit, minmax(220px, 1fr))"
        gap="3"
      >
        {data.data.map((quiz) => (
          <QuizCard quiz={quiz} />
        ))}
      </Grid>
    </Container>
  );
}
