import { Text, Container, Box } from "@chakra-ui/react";

import { useGetQuizzesQuery } from "@/services/api";
import { QuizCard } from "@/components/QuizCard";

export default function Home() {
  const { data } = useGetQuizzesQuery();

  if (!data) return null;

  return (
    <Container maxW="container.lg" gap="6" pt="5">
      <Text>
        Welcome to the ultimate quiz site! Here, you can test your knowledge and
        challenge your friends to see who comes out on top. We have a wide
        variety of quizzes covering topics ranging from pop culture to history,
        so there's something for everyone.
      </Text>

      <Box
        mt="10"
        sx={{ columnCount: [1, 2, 3], columnGap: "3" }}
        >
        {data.data.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </Box>
    </Container>
  );
}
