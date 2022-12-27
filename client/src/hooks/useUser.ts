import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState<{
    avatar: {
      username: string;
      picture_url: string;
      bio: string;
    };
    email: string;
    name: string;
    country_abbr: string;
    gender: string | null;
    quizzes: string[];
    likedQuizzes: string[];
    followers: string[];
    isBanned: boolean;
    isVerified: boolean;
    isAuth: boolean;
  }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/users/me", { credentials: "include" })
      .then((res) => res.json())
      .then(setUser)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    window.location.href = "http://localhost:3001/api/auth/logout";
  };

  return { user, isLoading, isAuth: !!user?.isAuth, logout };
};

export default useUser;
