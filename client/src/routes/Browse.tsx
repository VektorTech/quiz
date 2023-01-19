import { QuizListResponse } from "@/services/api";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Container } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import ReactPaginate from "react-paginate";
import { useLoaderData } from "react-router-dom";

const Paginate = styled(ReactPaginate)`
  display: flex;
  justify-content: center;
  gap: 5px;
  list-style: none;
`;

export default function Browse() {
  const quizList = useLoaderData() as QuizListResponse;

  console.log(quizList)

  return (
    <Container maxW="container.lg">
      <Helmet>
        <title>Quizzes</title>
      </Helmet>
      <Paginate
        breakLabel="..."
        previousLabel={<ChevronLeftIcon boxSize="6" />}
        nextLabel={<ChevronRightIcon boxSize="6" />}
        // onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={quizList.numPages}
        renderOnZeroPageCount={undefined}
      />
    </Container>
  );
}
