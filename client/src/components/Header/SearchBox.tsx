import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBox = ({ full = false }) => {
  return (
    <InputGroup marginRight="5" display="inline" width="fit-content">
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon boxSize={6} color="gray.300" />}
      />
      <Input
        htmlSize={full ? 25 : 12}
        focusBorderColor="purple.300"
        width="auto"
        type="search"
        placeholder="Search Quizzes"
      />
    </InputGroup>
  );
};

export default SearchBox;
