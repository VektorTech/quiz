import { useAppSelector } from "@/app/hooks";
import { selectQuizById } from "@/features/quiz/quizSlice";
import { responsesLoaderReturn } from "@/loaders/responsesLoader";
import { UserType } from "@/services/api";
import { Container, Heading, Stack, useColorMode } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData } from "react-router-dom";
import * as d3 from "d3";

export default function Dashboard({ user }: { user: UserType }) {
  const { quizID, responses } = useLoaderData() as responsesLoaderReturn;
  const quiz = useAppSelector((state) => selectQuizById(state, quizID));
  const chartsRef = useRef<HTMLDivElement>(null);
  const {colorMode} = useColorMode();

  const data = quiz?.questions.reduce<
    Array<{
      question: string;
      answers: Array<[string, number]>;
    }>
  >((prev, curr) => {
    const answers = curr.choices.map(({ text }) => {
      const count = responses.data.reduce<number>(
        (p, c) =>
          p + +(c.answers[curr.question as keyof typeof c.answers] === text),
        0
      );
      return [text, count] as [string, number];
    });

    prev.push({
      question: curr.question,
      answers,
    });

    return prev;
  }, []);

  useEffect(() => {
    if (chartsRef.current && data) {
      chartsRef.current.innerHTML = "";

      const charts = d3.select(chartsRef.current).append("div");

      const group = charts.selectAll("div").data(data).enter().append("div");
      group.style("margin-top", "20px");

      group.append("p").text((q) => q.question);
      const innerGroups = group
        .append("svg")
        .style("margin-top", "5px")
        .style("margin-left", "5px")
        .attr("height", (d) => d.answers.length * 40)
        .selectAll("g")
        .data((q) => q.answers)
        .enter()
        .append("g");

      innerGroups
        .append("text")
        .text((q) => `${q[0]} (${q[1]})`)
        .attr("fill", colorMode === "dark" ? "#ddd" : "#333")
        .attr("y", (d, i) => 20 + i * 40);

      innerGroups
        .append("rect")
        .attr("fill", colorMode === "dark" ? "#ddd" : "#333")
        .attr("width", (q) => (q[1] / (responses.data.length || 1)) * 250)
        .attr("height", 7)
        .attr("y", (d, i) => 25 + i * 40);

      innerGroups
        .append("rect")
        .attr("stroke", colorMode === "dark" ? "#ddd" : "#333")
        .attr("stroke-width", 0.5)
        .attr("fill", "none")
        .attr("width", 250)
        .attr("height", 7)
        .attr("y", (d, i) => 25 + i * 40);
    }
  }, [colorMode, data, responses.data.length]);

  return (
    <Container maxW="container.lg">
      <Helmet>
        <title>{quiz ? `Response Stats for ${quiz.name}` : ""}</title>
      </Helmet>

      <Stack pt="10">
        <Heading fontSize="xl">Stats for {quiz?.name}</Heading>
      </Stack>

      <div ref={chartsRef}></div>
    </Container>
  );
}
