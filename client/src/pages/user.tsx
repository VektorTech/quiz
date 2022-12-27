import { Navigate } from "react-router-dom";
import useUser from "@/hooks/useUser";

export default function User() {
  const { user, isAuth, isLoading, logout } = useUser();
  // isAuthenticated, isLoading

  // console.log(user);
  if (isLoading) return <div>Loading...</div>
  return isAuth ? (
  <div>
    <span>My Profile: {user?.avatar.username}</span>
    <br />
    <button onClick={logout}>Logout</button>
  </div>
  ) : <div>Login</div>;
}
