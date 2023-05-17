import { Link } from "react-router-dom";
import {
  Badge,
  Card,
  CardBody,
  Heading,
  Image,
  Stack,
  Text,
  Box
} from "@chakra-ui/react";

import PlaceholderImage from "@/assets/images/quiz-img-placeholder.jpg";
import { QuizType } from "@/services/api";

export default function QuizCard({ quiz }: { quiz: QuizType }) {
  return (
    <Box key={quiz.id} mb="3">
      <Link to={`/${quiz.slug}`} style={{ display: "inline-block" }}>
        <Card maxW="sm" float="left" sx={{ breakInside: "avoid-column" }}>
          <Image
            objectFit="cover"
            width="100%"
            maxH="13.7rem"
            src={quiz.image || PlaceholderImage}
            alt={quiz.title}
          />
          <CardBody>
            <Badge display="table" ml="auto" mb="1">{quiz.category}</Badge>
            <Stack spacing="3">
              <Heading size="md">{quiz.title}</Heading>
              <Text>{quiz.description}</Text>
            </Stack>
          </CardBody>
        </Card>
      </Link>
    </Box>
  );
}
