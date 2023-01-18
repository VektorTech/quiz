import { useEffect, useRef } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  CircularProgress,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  Link,
  List,
  ListItem,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as RLink, useLocation } from "react-router-dom";

import SearchBox from "./SearchBox";

import { CATEGORIES } from "@/libs/constants";
import { useGetAuthUserQuery } from "@/services/api";
import CreateIcon from "../Icons/CreateIcon";

const HeaderDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, isLoading } = useGetAuthUserQuery();
  const toggleBtn = useRef(null);

  const location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(onClose, [location]);

  return (
    <>
      <Button
        ref={toggleBtn}
        colorScheme="purple"
        as={IconButton}
        icon={<HamburgerIcon />}
        onClick={onOpen}
        display={{ base: "inline-flex", md: "none" }}
      />

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={toggleBtn}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {isLoading ? (
              <CircularProgress
                isIndeterminate
                margin="auto 0"
                size="32px"
                color="purple.300"
              />
            ) : (
              <RLink to="/me">
                <Avatar
                  name={data?.name}
                  src={data?.avatar.picture_url}
                  margin="auto 0"
                  size="sm"
                  bg="purple.500"
                  referrerPolicy="no-referrer"
                >
                  {data?.isAuth ? (
                    <AvatarBadge boxSize="1.1em" bg="green.300" />
                  ) : null}
                </Avatar>

                <Text>{data?.avatar.username}</Text>
              </RLink>
            )}
          </DrawerHeader>

          <DrawerBody>
            <VStack alignItems={"flex-start"}>
              <Button
                width="100%"
                leftIcon={<CreateIcon />}
                as={RLink}
                to={"/create"}
                colorScheme="purple"
              >
                Create A Quiz
              </Button>
            </VStack>

            <VStack alignItems={"flex-start"} pt={2}>
              <SearchBox full />
            </VStack>

            <Accordion marginTop={2} defaultIndex={[1]} allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box fontWeight="500" as="span" flex="1" textAlign="left">
                      Profile
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {data?.isAuth ? (
                    <Box>
                      <List>
                        <ListItem>
                          <Link as={RLink} to={"/me"}>
                            My Account
                          </Link>
                        </ListItem>
                        <ListItem>
                          <Link
                            as={RLink}
                            to="//localhost:3001/api/auth/logout"
                          >
                            Logout
                          </Link>
                        </ListItem>
                      </List>
                    </Box>
                  ) : (
                    <List>
                      <ListItem>
                        <Link
                          as={RLink}
                          to="//localhost:3001/api/auth/login"
                        >
                          Login
                        </Link>
                      </ListItem>
                    </List>
                  )}
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box fontWeight="500" as="span" flex="1" textAlign="left">
                      Categories
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <nav>
                    <List spacing={3}>
                      {CATEGORIES.map((category) => (
                        <ListItem
                          key={"drawer:" + category}
                          textTransform="capitalize"
                        >
                          <Link as={RLink} to={`browse/${category}`}>
                            {category}
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </nav>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </DrawerBody>

          <DrawerFooter justifyContent={"start"}>
            <Stack color="gray.400" spacing={0}>
              <Text fontSize="sm">
                &copy; {new Date().getFullYear()} QuizWrld. All Rights Reserved.
              </Text>
              <Text fontSize="sm">Developed by Kenny Sutherland.</Text>
            </Stack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default HeaderDrawer;
