import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthForm } from "@/components/AuthForm";

const Layout = () => {
  return (
    <>
      <Header />
      <Box as="main" mb="10" minH="100vh" position="relative">
        <Outlet />
      </Box>
      <Footer />
      <AuthForm />
    </>
  );
};

export default Layout;
