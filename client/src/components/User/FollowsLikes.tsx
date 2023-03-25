import {
  Avatar,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Wrap,
  WrapItem,
  Link,
  Image,
  VStack,
  AspectRatio,
} from "@chakra-ui/react";

import {
  QuizType,
  useGetUserByIdQuery,
  UserType,
} from "@/services/api";
import { useState } from "react";
import { Link as RLink } from "react-router-dom";

export default function FollowsLikes({ user }: { user: UserType }) {
  const [modalState, setModalState] = useState<{
    state: "Followers" | "Following" | "Favorites" | "";
    data: Array<string> | null;
  }>({
    state: "",
    data: null,
  });

  return (
    <>
      <HStack textAlign="center">
        <Stack spacing={0}>
          <Text>Following</Text>
          <Button
            variant="unstyled"
            fontSize="xl"
            fontWeight="bold"
            onClick={() =>
              setModalState({
                state: "Following",
                data: user.following,
              })
            }
          >
            {user.following.length}
          </Button>
        </Stack>
        <Stack spacing={0}>
          <Text>Followers</Text>
          <Button
            variant="unstyled"
            fontSize="xl"
            fontWeight="bold"
            onClick={() =>
              setModalState({
                state: "Followers",
                data: user.followers,
              })
            }
          >
            {user.followers.length}
          </Button>
        </Stack>
        <Stack spacing={0}>
          <Text>Favorites</Text>
          <Button
            variant="unstyled"
            fontSize="xl"
            fontWeight="bold"
            onClick={() =>
              setModalState({
                state: "Favorites",
                data: null,
              })
            }
          >
            {user.likedQuizzes.length}
          </Button>
        </Stack>
      </HStack>

      <Modal
        isOpen={!!modalState.state}
        onClose={() => setModalState({ state: "", data: null })}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>{modalState.state}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Wrap>
              {modalState.state === "Favorites"
                ? user.likedQuizzes.map((quiz) => (
                    <Likes key={quiz.id} quiz={quiz} />
                  ))
                : modalState.data?.map((id) => <Follows key={id} id={id} />)}
            </Wrap>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const Follows = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetUserByIdQuery(id);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) return <p>Error!</p>;

  const { data: user } = data;

  return (
    <WrapItem w="full">
      <Link w="full" as={RLink} to={`/user/${user.id}`}>
        <HStack>
          <Avatar src={user.avatar.picture_url} />
          <Text>{user.avatar.username}</Text>
        </HStack>
      </Link>
    </WrapItem>
  );
};

const Likes = ({ quiz }: { quiz: QuizType }) => {
  return (
    <WrapItem w="full">
      <Link
        w="full"
        _hover={{ textDecor: "none" }}
        as={RLink}
        to={`/${quiz.id}`}
      >
        <HStack>
          <AspectRatio ratio={1} w="32">
            <Image src={quiz.image} alt={`${quiz.title} poster`} />
          </AspectRatio>
          <VStack overflow="hidden" alignItems="start">
            <Text
              fontWeight="bold"
              maxW="full"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {quiz.title}
            </Text>
            <Text
              maxW="full"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
              color="GrayText"
            >
              {quiz.description}
            </Text>
          </VStack>
        </HStack>
      </Link>
    </WrapItem>
  );
};
