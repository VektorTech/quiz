import { useNavigate, useLoaderData, Navigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

import { QuizCard } from "@/components/QuizCard";
import { quizzesLoaderReturn } from "@/loaders/quizzesLoader";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Container, Grid } from "@chakra-ui/react";

const Paginate = styled(ReactPaginate)`
  display: flex;
  justify-content: center;
  gap: 5px;
  list-style: none;
`;

export default function Browse() {
  const { quizzes: quizList } = useLoaderData() as quizzesLoaderReturn;
  const navigate = useNavigate();

  if (!quizList.currentPageCount) {
    return <Navigate to="/" />
  }

  return (
    <Container maxW="container.lg">
      <Helmet>
        <title>Quizzes</title>
      </Helmet>

      <Grid
        mt="10"
        templateColumns="repeat(auto-fit, minmax(220px, 1fr))"
        gap="3"
      >
        {quizList.data.map((quiz) => (
          <QuizCard quiz={quiz} />
        ))}
      </Grid>

      <Paginate
        breakLabel="..."
        previousLabel={<ChevronLeftIcon boxSize="6" />}
        nextLabel={<ChevronRightIcon boxSize="6" />}
        onPageChange={(event) => {
          const offset =
            (event.selected * quizList.perPage) % quizList.currentPageCount;
          const url = new URL(window.location.href);
          url.searchParams.set("page", offset.toString());
          navigate(url);
        }}
        pageRangeDisplayed={5}
        pageCount={quizList.numPages}
        renderOnZeroPageCount={undefined}
      />
    </Container>
  );
}
