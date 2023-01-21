import { Center, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Form } from "react-router-dom";
import styled from "@emotion/styled";

const SearchForm = styled(Form)`
  width: 100%;
`;

const SearchBox = ({ full = false }) => {
  return (
    <SearchForm action="/browse" role="searchbox">
      <Center>
        <InputGroup
          marginRight={full ? 0 : 5}
          display="inline"
          width={full ? "100%" : "fit-content"}
        >
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon boxSize="6" color="gray.300" />}
          />
          <Input
            htmlSize={full ? 0 : 12}
            width={full ? "100%" : "auto"}
            type="search"
            aria-label="Search quizzes"
            placeholder="Search Quizzes"
            name="search"
          />
        </InputGroup>
        <input type="submit" hidden />
      </Center>
    </SearchForm>
  );
};

export default SearchBox;
