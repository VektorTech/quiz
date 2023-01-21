import { useAppDispatch } from "@/app/hooks";
import { openModal } from "@/features/ui/uiSlice";
import { useGetAuthUserQuery, UserType } from "@/services/api";
import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { PageSpinner } from "@/components/PageSpinner";

export default function ProtectedRoute({
  component: Render,
}: {
  component: (props: { user: UserType }) => ReactElement;
}) {
  const { data: user, isLoading } = useGetAuthUserQuery();
  const dispatch = useAppDispatch();

  if (isLoading) {
    return <PageSpinner />;
  }

  if (user?.isAuth) {
    return <Render user={user} />;
  }

  dispatch(openModal("LOGIN"));
  return <Navigate to="/" replace />;
}
