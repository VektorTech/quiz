import styled from "@emotion/styled";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  CircularProgress,
  Container,
  Divider,
  HStack,
  Image,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  Text,
  MenuList,
  useDisclosure,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { Link as RLink, useNavigate } from "react-router-dom";
import Logo from "@/assets/icons/Logo.svg";

import HeaderDrawer from "./HeaderDrawer";
import SearchBox from "./SearchBox";
import HeaderMenu from "./HeaderMenu";

import { useGetAuthUserQuery } from "@/services/api";
import CreateIcon from "../Icons/CreateIcon";
import GoogleIcon from "../Icons/GoogleIcon";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { EditIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";

const HeaderElement = styled.header`
  height: 80px;
`;

const Header = () => {
  const { data, isLoading } = useGetAuthUserQuery();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, handleSubmit } = useForm();

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
                      <MenuItem onClick={onOpen}>Login</MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}
            </Box>
          </Box>
        </Container>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxW="18rem">
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Button
                width="100%"
                onClick={() => {
                  window.location.href =
                    "//localhost:3001/api/auth/login/google";
                }}
                leftIcon={<GoogleIcon />}
              >
                Continue with Google
              </Button>
            </Center>

            <HStack mt="3" mb="3">
              <Divider />
              <Text style={{ fontVariant: "small-caps" }} pl="1" pr="1">
                or
              </Text>
              <Divider />
            </HStack>

            <Stack gap="1">
              <FormControl>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<EmailIcon color="gray.300" />}
                  />
                  <Input type="email" {...register("username")} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<LockIcon color="gray.300" />}
                  />
                  <Input type="password" {...register("password")} />
                </InputGroup>
              </FormControl>
              <Button
                colorScheme="purple"
                width="100%"
                onClick={handleSubmit((data) => {
                  fetch("//localhost:3001/api/auth/login/ropc", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  })
                    .then((res) => {
                      if (res.ok) {
                        navigate("/me");
                        onClose();
                      }
                      console.log(res);
                    })
                    .catch(console.log);
                })}
              >
                Log In
              </Button>
              <Button
                variant="ghost"
                leftIcon={<EditIcon />}
                fontSize="sm"
                color="gray.600"
                onClick={() => {
                  window.location.href = "//localhost:3001/api/auth/login";
                }}
              >
                Create An Account
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </HeaderElement>
  );
};

export default Header;
