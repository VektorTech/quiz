import { Link } from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  Container,
  Grid,
  GridItem,
} from "@chakra-ui/react";

import PlaceholderImage from "@/assets/images/quiz-img-placeholder.jpg";
import { useGetQuizzesQuery } from "@/services/api";

export default function Home() {
  const { data } = useGetQuizzesQuery();

  if (!data) return null;

  return (
    <Container maxW="container.lg" gap="6">
      <Text mt="5">
        Welcome to the ultimate quiz site! Here, you can test your knowledge and
        challenge your friends to see who comes out on top. We have a wide variety
        of quizzes covering topics ranging from pop culture to history, so there's
        something for everyone.
      </Text>

      <Grid
        mt="10"
        templateColumns="repeat(auto-fit, minmax(220px, 1fr))"
        gap="3"
      >
        {data.data.map((quiz) => (
          <GridItem key={quiz.id} maxW="320px">
            <Link to={{ pathname: quiz.slug }}>
              <Card maxW="sm" float="left">
                <Stack direction="row" justifyContent="flex-end">
                  <Badge>{quiz.category}</Badge>
                </Stack>
                <Image
                  objectFit="cover"
                  width="100%"
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
