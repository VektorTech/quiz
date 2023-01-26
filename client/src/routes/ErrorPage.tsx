import { verifyError, verifyFBQError } from "@/utils";
import { Code, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  const ErrorMessage = (() => {
    if (verifyFBQError(error)) {
      return (
        <Text>
          <Code fontWeight="bold">status: {error.status}</Code>
          <br />
          <Code textAlign="left" mt="2" color="red">
            {error.error?.toString()}
          </Code>
        </Text>
      );
    } else if (verifyError(error)) {
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
        <Heading as="h1">Oops!</Heading>
        <Text>Sorry, an unexpected error has occurred.</Text>

        {ErrorMessage}
      </VStack>
    </Container>
  );
}
