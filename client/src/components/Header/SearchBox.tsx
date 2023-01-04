import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBox = ({ full = false }) => {
  return (
    <InputGroup
      marginRight={full ? 0 : "5"}
      display="inline"
      width={full ? "100%" : "fit-content"}
    >
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon boxSize={6} color="gray.300" />}
      />
      <Input
        htmlSize={full ? 0 : 12}
        width={full ? "100%" : "auto"}
        focusBorderColor="purple.300"
        type="search"
        placeholder="Search Quizzes"
      />
    </InputGroup>
  );
};

export default SearchBox;
