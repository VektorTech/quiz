import { Box, Container, Stack, Text, useColorModeValue } from "@chakra-ui/react";

export default function Footer() {
  const bgColor = useColorModeValue("gray.800", "black");

  return (
    <Box as="footer" bgColor={bgColor} py="3">
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
