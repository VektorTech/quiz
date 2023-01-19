import { useGetAuthUserQuery } from "@/services/api";
import { Text } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function Protected({
  children,
}: {
  children: ReactNode;
}) {
  const { data: user, isLoading, isError } = useGetAuthUserQuery();

  if (isLoading) {
    return <Text>Loading Page...</Text>;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (user?.isAuth) {
    return <>{children}</>;
  }

  return <Navigate to="/" />;
}
