import { Code, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { Helmet } from "react-helmet-async";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  const ErrorMessage = (() => {
    if (validateFBQError(error)) {
      return (
        <Text>
          <Code fontWeight="bold">status: {error.status}</Code>
          <br />
          <Code textAlign="left" mt="2" color="red">
            {error.error}
          </Code>
        </Text>
      );
    } else if (validateError(error)) {
      return (
        <Text>
          <Code textAlign="left" color="red">
            {error.message}
          </Code>
        </Text>
      );
    }
  })();

  return (
    <Container>
      <Helmet>
        <title>Something Went Wrong!</title>
      </Helmet>

      <VStack
        as="article"
        textAlign="center"
        gap="2"
        h="100vh"
        justifyContent="center"
      >
        <Heading>Oops!</Heading>
        <Text>Sorry, an unexpected error has occurred.</Text>

        {ErrorMessage}
      </VStack>
    </Container>
  );
}

function validateFBQError(
  error: unknown
): error is FetchBaseQueryError & { error?: string } {
  return (
    typeof error == "object" &&
    error != null &&
    "status" in error &&
    "error" in error
  );
}

function validateError(error: unknown): error is Error {
  return typeof error == "object" && error != null && "message" in error;
}
