import { useAppDispatch } from "@/app/hooks";
import { openModal } from "@/features/ui/uiSlice";
import { useGetAuthUserQuery, UserType } from "@/services/api";
import { Flex, Spinner } from "@chakra-ui/react";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  component: Render,
}: {
  component: (props: { user: UserType }) => ReactElement;
}) {
  const { data: user, isLoading } = useGetAuthUserQuery();
  const dispatch = useAppDispatch();

  if (isLoading) {
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

  if (user?.isAuth) {
    return <Render user={user} />;
  }

  dispatch(openModal("LOGIN"));
  return <Navigate to="/" replace />;
}
