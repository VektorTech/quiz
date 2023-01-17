import styled from "@emotion/styled";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  CircularProgress,
  Container,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { Link as RLink, useNavigate } from "react-router-dom";
import Logo from "@/assets/Logo.svg";

import HeaderDrawer from "./HeaderDrawer";
import SearchBox from "./SearchBox";
import HeaderMenu from "./HeaderMenu";

import { useGetAuthUserQuery } from "@/services/api";
import CreateIcon from "../Icons/CreateIcon";

const HeaderElement = styled.header`
  height: 80px;
`;

const Header = () => {
  const { data, isLoading } = useGetAuthUserQuery();
  const navigate = useNavigate();

  return (
    <HeaderElement>
      <Container
        width="100%"
        maxW="100%"
        padding="0"
        position="fixed"
        zIndex="10"
        borderBottom="1px solid"
        borderColor="gray.300"
        background="#fff"
      >
        <Container maxW="container.lg">
          <Box
            maxH="70px"
            padding="15px 0"
            display="flex"
            justifyContent="space-between"
          >
            <HeaderMenu />
            <HeaderDrawer />

            <Center
              ml={{ base: "auto", md: "5" }}
              transform={{
                base: "translateX(-24px)",
                md: "translateX(0px)",
              }}
              mr="auto"
            >
              <Link as={RLink} to="/">
                <Image width="130px" src={Logo} alt="QuizWrld.co Logo" />
              </Link>
            </Center>

            <Button
              as={RLink}
              leftIcon={<CreateIcon />}
              to="/create"
              marginLeft="auto"
              marginRight="5"
              colorScheme="purple"
              display={{ base: "none", md: "inline-flex" }}
            >
              Create A Quiz
            </Button>

            <Box display={{ base: "none", md: "inline-flex" }}>
              <SearchBox />
            </Box>

            <Box display={{ base: "none", md: "inline-flex" }}>
              {isLoading ? (
                <CircularProgress
                  isIndeterminate
                  margin="auto 0"
                  size="32px"
                  color="purple.300"
                />
              ) : (
                <Menu>
                  <MenuButton>
                    <Avatar
                      name={data?.name}
                      src={data?.avatar.picture_url}
                      margin="auto 0"
                      size="sm"
                      bg="purple.500"
                    >
                      {data?.isAuth ? (
                        <AvatarBadge boxSize="1.1em" bg="green.300" />
                      ) : null}
                    </Avatar>
                  </MenuButton>
                  <MenuList>
                    {data?.isAuth ? (
                      <MenuGroup title="Profile">
                        <MenuItem onClick={() => navigate("/me")}>
                          My Account
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            (window.location.href =
                              "//localhost:3001/api/auth/logout")
                          }
                        >
                          Logout
                        </MenuItem>
                      </MenuGroup>
                    ) : (
                      <MenuItem
                        onClick={() =>
                          (window.location.href =
                            "//localhost:3001/api/auth/login")
                        }
                      >
                        Login
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </Box>
          </Box>
        </Container>
      </Container>
    </HeaderElement>
  );
};

export default Header;
