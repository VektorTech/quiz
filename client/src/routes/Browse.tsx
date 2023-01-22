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
  position: absolute;
  bottom: 5px;
  font-size: 16px;
  left: 0;
  right: 0;

  & li {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    color: #999;
    transition: background-color 0.3s;

    &:hover {
      background-color: #eee;
    }

    &.selected {
      background-color: var(--chakra-colors-brand-500);
      color: #fff;

      &:hover {
        background-color: var(--chakra-colors-brand-600);
      }
    }

    > a {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }
  }
`;

export default function Browse() {
  const { quizzes: quizList } = useLoaderData() as quizzesLoaderReturn;
  const navigate = useNavigate();

  if (!quizList.currentPageCount) {
    return <Navigate to="/" />;
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
          <QuizCard key={quiz.id} quiz={quiz} />
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
