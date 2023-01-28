import { Box, Container, Stack, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" bgColor="gray.800" py="3">
      <Container maxW="container.lg" textAlign="center">
        <Stack color="gray.400" spacing={0}>
          <Text fontSize="sm">
            &copy; {new Date().getFullYear()} QuizWrld. All Rights Reserved.
          </Text>
          <Text fontSize="sm">Developed by Kenny Sutherland.</Text>
        </Stack>
      </Container>
    </Box>
  );
}
