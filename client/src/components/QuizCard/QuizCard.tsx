import { Link } from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  GridItem,
} from "@chakra-ui/react";

import PlaceholderImage from "@/assets/images/quiz-img-placeholder.jpg";
import { QuizType } from "@/services/api";

export default function QuizCard({ quiz }: { quiz: QuizType }) {
  return (
    <GridItem key={quiz.id}>
      <Link to={`/${quiz.slug}`}>
        <Card maxW="sm" float="left">
          <Image
            objectFit="cover"
            width="100%"
            maxH="13.7rem"
            src={quiz.image || PlaceholderImage}
            alt={quiz.title}
          />
          <CardBody>
            <Badge float="right">{quiz.category}</Badge>
            <Stack spacing="3">
              <Heading size="md">{quiz.title}</Heading>
              <Text>{quiz.description}</Text>
            </Stack>
          </CardBody>
        </Card>
      </Link>
    </GridItem>
  );
}
