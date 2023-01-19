import { useGetAuthUserQuery, UserType } from "@/services/api";
import { Flex, Spinner } from "@chakra-ui/react";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function ProtectedRoute({
  component: Render,
}: {
  component: (props: { user: UserType }) => ReactElement;
}) {
  const { data: user, isLoading, isError } = useGetAuthUserQuery();

  if (isLoading) {
    return (
      <Flex pt="20">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
          margin="auto"
        />
      </Flex>
    );
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (user?.isAuth) {
    return <Render user={user} />;
  }

  return <Navigate to="/" />;
}
