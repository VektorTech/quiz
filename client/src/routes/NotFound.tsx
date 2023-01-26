import { Container, Heading, Link, Text, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { Link as RLink } from "react-router-dom";

export default function NotFound() {
  return (
    <Container>
      <Helmet>
        <title>Not Found!</title>
      </Helmet>

      <VStack
        as="article"
        textAlign="center"
        gap="2"
        pt="20"
        justifyContent="center"
      >
        <Heading as="h1">404</Heading>
        <Text as="h2">Page Not Found</Text>
        <Link as={RLink} to="/">
          Back home
        </Link>
      </VStack>
    </Container>
  );
}
