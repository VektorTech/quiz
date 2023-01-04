import { Link } from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";

import { useGetQuizzesQuery } from "@/services/quiz";
import { Container, Grid, GridItem } from "@chakra-ui/react";

import PlaceholderImage from "@/assets/quiz-img-placeholder.png";

export default function Home() {
  const { data } = useGetQuizzesQuery();

  if (!data) return null;

  return (
    <Container maxW="container.lg" gap={6}>
      <Heading mt="5" mb="5" textAlign={"center"}>
        QuizWrld
      </Heading>

      <Text>
        Welcome to the ultimate quiz site! Here, you can test your knowledge and
        challenge your friends to see who comes out on top. With a wide variety
        of quizzes covering topics ranging from pop culture to history, there's
        something for everyone.
      </Text>

      <Grid mt="10" templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={5}>
        {data.data.map((quiz) => (
          <GridItem key={quiz.id}>
            <Link to={{ pathname: quiz.id }}>
              <Card maxW="sm">
                <Stack direction={"row"} justifyContent={"flex-end"}>
                  <Badge colorScheme="purple">{quiz.category}</Badge>
                </Stack>
                <Image
                  objectFit="cover"
                  width={"100%"}
                  src={quiz.image ?? PlaceholderImage}
                  alt={quiz.title}
                />
                <CardBody>
                  <Stack spacing="3">
                    <Heading size="md">{quiz.title}</Heading>
                    <Text>{quiz.description}</Text>
                  </Stack>
                </CardBody>
              </Card>
            </Link>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
}
