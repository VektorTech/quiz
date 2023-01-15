import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "../Footer";
import { Box } from "@chakra-ui/react";

const Layout = () => {
  return (
    <>
      <Header />
      <Box as="main" mb="10">
        <Outlet />
      </Box>
      <Footer />
    </>
  );
};

export default Layout;
