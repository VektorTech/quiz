import styled from "@emotion/styled";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  CircularProgress,
  Container,
  VStack,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Switch,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RLink, useNavigate } from "react-router-dom";

import Logo from "@/assets/icons/Logo.svg";
import { HeaderDrawer } from "@/components/HeaderDrawer";
import SearchBox from "../SearchBox/SearchBox";
import HeaderMenu from "./HeaderMenu";

import { useGetAuthUserQuery } from "@/services/api";
import CreateIcon from "@/components/Icons/CreateIcon";

import { openModal } from "@/features/ui/uiSlice";
import { useAppDispatch } from "@/app/hooks";
import { SERVER_ADDRESS } from "@/utils/constants";

const HeaderElement = styled.header`
  height: 70px;
`;

const Header = () => {
  const { data, isLoading } = useGetAuthUserQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const headerBg = useColorModeValue("white", "gray.800");
  const headerBorder = useColorModeValue("gray.300", "gray.700");

  return (
    <HeaderElement>
      <Container
        width="100%"
        maxW="100%"
        padding="0"
        position="fixed"
        zIndex="10"
        borderBottom="1px solid"
        borderColor={headerBorder}
        bgColor={headerBg}
      >
        <Container maxW="container.xl">
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

            <VStack spacing={0.5} display={{ base: "none", md: "inline-flex" }}>
              <Text fontWeight="medium" fontSize="xs">
                Dark Mode
              </Text>
              <Switch
                isChecked={colorMode === "dark"}
                onChange={toggleColorMode}
              />
            </VStack>

            <Button
              as={RLink}
              leftIcon={<CreateIcon />}
              to="/create"
              ml="auto"
              mr="5"
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
                  color="brand.300"
                />
              ) : (
                <Menu>
                  <MenuButton>
                    <Avatar
                      name={data?.name}
                      src={data?.avatar.picture_url}
                      margin="auto 0"
                      size="sm"
                      referrerPolicy="no-referrer"
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
                            (window.location.href = `${SERVER_ADDRESS}/api/auth/logout`)
                          }
                        >
                          Logout
                        </MenuItem>
                      </MenuGroup>
                    ) : (
                      <MenuItem onClick={() => dispatch(openModal("LOGIN"))}>
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
