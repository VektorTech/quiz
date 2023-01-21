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
    <GridItem key={quiz.id} maxW="320px">
      <Link to={{ pathname: quiz.slug }}>
        <Card maxW="sm" float="left">
          <Stack direction="row" justifyContent="flex-end">
            <Badge>{quiz.category}</Badge>
          </Stack>
          <Image
            objectFit="cover"
            width="100%"
            src={quiz.image || PlaceholderImage}
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
  );
}
