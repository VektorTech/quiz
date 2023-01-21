import { Flex, Spinner } from "@chakra-ui/react";

export default function PageSpinner() {
  return (
    <Flex pt="20">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="brand.500"
        size="xl"
        margin="auto"
      />
    </Flex>
  );
}
