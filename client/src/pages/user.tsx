import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Container,
  Link,
  Text,
  Heading,
  Stack,
  Badge,
  Image,
  HStack,
  Avatar,
  Divider,
  Checkbox,
  IconButton,
  Center,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import {
  useDeleteQuizMutation,
  useGetAuthUserQuery,
  useUpdateQuizMutation,
} from "@/services/api";
import { Link as RLink } from "react-router-dom";
import PlaceholderImage from "@/assets/quiz-img-placeholder.png";
import MoreVerticalIcon from "@/components/Icons/MoreVerticalIcon";
import { AtSignIcon, DeleteIcon, EditIcon, TimeIcon } from "@chakra-ui/icons";
import LocationIcon from "@/components/Icons/LocationIcon";
import VerifiedIcon from "@/components/Icons/VerifiedIcon";
import PublishIcon from "@/components/Icons/PublishIcon";

export default function User() {
  const { data, isLoading } = useGetAuthUserQuery();
  const [updateQuiz] = useUpdateQuizMutation();
  const [deleteQuiz] = useDeleteQuizMutation();

  if (isLoading) return <Container textAlign="center">Loading...</Container>;

  return data?.isAuth ? (
    <Container maxW="container.lg">
      <Center flexDirection="column" gap="5" marginTop="40px">
        <Stack alignItems="center">
          <Avatar
            name={data.name}
            src={data.avatar.picture_url}
            margin="auto 0"
            size="2xl"
            bg="purple.500"
          />
          <Heading as="h1" size="md">
            <AtSignIcon mr="0.5" verticalAlign="bottom" />
            {data.avatar.username}
            {data.isVerified ? (
              <VerifiedIcon boxSize={6} verticalAlign="bottom" />
            ) : null}
          </Heading>
        </Stack>

        <Text>{data.avatar.bio ?? "No bio yet"}</Text>

        <Center gap="2">
          <Center fontSize="sm">
            <LocationIcon boxSize={5} />
            {data.country_abbr ?? "unknown"}
          </Center>
          <Center fontSize="sm">
            <TimeIcon boxSize={4} mr="1" /> Joined{" "}
            {new Intl.DateTimeFormat("en", dateFormatOptions).format(
              new Date(data.createdAt)
            )}
          </Center>
        </Center>

        <HStack textAlign="center">
          <Stack spacing={0}>
            <Text>Following</Text>
            <Text fontSize="lg" fontWeight="bold">
              {0}
            </Text>
          </Stack>
          <Stack spacing={0}>
            <Text>Followers</Text>
            <Text fontSize="lg" fontWeight="bold">
              {data.followers.length}
            </Text>
          </Stack>
          <Stack spacing={0}>
            <Text>Favorites</Text>
            <Text fontSize="lg" fontWeight="bold">
              {data.likedQuizzes.length}
            </Text>
          </Stack>
        </HStack>
      </Center>

      <TableContainer whiteSpace="normal">
        <Divider mt="10" />
        <Table size="sm" variant="simple">
          <TableCaption fontSize="md" placement="top">
            Your Quizzes ({data.quizzes.length})
          </TableCaption>

          <Thead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Category</Th>
              <Th>Likes</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.quizzes.map(
              ({ title, image, category, id, status, likes, slug }) => (
                <Tr key={id}>
                  <Td>
                    <Checkbox />
                  </Td>
                  <Td title={title} minW="120px">
                    <Link as={RLink} to={`/${slug}`}>
                      <HStack>
                        <Image
                          src={image ?? PlaceholderImage}
                          width="40px"
                          height="40px"
                          objectFit="cover"
                          borderRadius={5}
                          alt=""
                        />
                        <Text fontWeight="bold">{title}</Text>
                      </HStack>
                    </Link>
                  </Td>
                  <Td>
                    <Badge colorScheme={BadgeColor[status]}>{status}</Badge>
                  </Td>
                  <Td>
                    <Badge>{category.toUpperCase()}</Badge>
                  </Td>
                  <Td isNumeric>{likes}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVerticalIcon boxSize={5} />}
                        aria-label="more actions"
                      />
                      <MenuList>
                        <MenuItem icon={<EditIcon boxSize={4} />}>
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            updateQuiz({
                              status:
                                status === "ACTIVE" ? "DRAFTED" : "ACTIVE",
                              id,
                            })
                          }
                          icon={<PublishIcon boxSize={4} />}
                        >
                          {status === "DRAFTED" ? "Publish" : "Pause"}
                        </MenuItem>
                        <MenuItem
                          onClick={() => deleteQuiz(id)}
                          icon={<DeleteIcon boxSize={4} />}
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  ) : (
    <div>Login</div>
  );
}

const logout = () => {
  window.location.href = "http://localhost:3001/api/auth/logout";
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};

const BadgeColor = {
  DRAFTED: "gray",
  ACTIVE: "green",
  CLOSED: "red",
};
