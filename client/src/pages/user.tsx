import { useGetAuthUserQuery } from "@/services/user";

const logout = () => {
  window.location.href = "http://localhost:3001/api/auth/logout";
};

export default function User() {
  const { data, isLoading } = useGetAuthUserQuery();

  if (isLoading) return <div>Loading...</div>;
  return data?.isAuth ? (
    <div>
      <span>My Profile: {data?.avatar.username}</span>
      <br />
      <button
        onClick={logout}
      >
        Logout
      </button>
    </div>
  ) : (
    <div>Login</div>
  );
}
