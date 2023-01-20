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
  Button,
} from "@chakra-ui/react";

import {
  useDeleteQuizMutation,
  useFollowUserMutation,
  useGetAuthUserQuery,
  useGetUserByIdQuery,
  useUpdateQuizMutation,
} from "@/services/api";
import {
  Link as RLink,
  Navigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import PlaceholderImage from "@/assets/images/quiz-img-placeholder.jpg";
import MoreVerticalIcon from "@/components/Icons/MoreVerticalIcon";
import { AtSignIcon, DeleteIcon, EditIcon, TimeIcon } from "@chakra-ui/icons";
import LocationIcon from "@/components/Icons/LocationIcon";
import VerifiedIcon from "@/components/Icons/VerifiedIcon";
import PublishIcon from "@/components/Icons/PublishIcon";
import { Helmet } from "react-helmet-async";

export default function User() {
  const params = useParams();
  const { data: authUser } = useGetAuthUserQuery();
  const { data, isLoading } = useGetUserByIdQuery(params.userID || "");
  const user = data?.data;

  const [followUser] = useFollowUserMutation();

  const [updateQuiz] = useUpdateQuizMutation();
  const [deleteQuiz] = useDeleteQuizMutation();

  if (isLoading) return <Container textAlign="center">Loading...</Container>;

  return user ? (
    <Container maxW="container.lg">
      <Helmet>
        <title>User | {user.avatar.username}</title>
      </Helmet>
      <Center flexDirection="column" gap="5" marginTop="40px">
        <Stack alignItems="center">
          <Avatar
            name={user.name}
            src={user.avatar.picture_url}
            margin="auto 0"
            size="2xl"
            bg="brand.500"
            referrerPolicy="no-referrer"
          />
          <Heading as="h1" size="md">
            <AtSignIcon mr="0.5" verticalAlign="bottom" />
            {user.avatar.username}
            {user.isVerified ? (
              <VerifiedIcon boxSize={6} verticalAlign="bottom" />
            ) : null}
          </Heading>
        </Stack>

        <Text>{user.avatar.bio ?? "No bio yet"}</Text>

        <Center gap="2">
          <Center fontSize="sm">
            <LocationIcon boxSize={5} />
            {user.country_abbr ?? "unknown"}
          </Center>
          <Center fontSize="sm">
            <TimeIcon boxSize={4} mr="1" /> Joined{" "}
            {new Intl.DateTimeFormat("en", dateFormatOptions).format(
              new Date(user.createdAt)
            )}
          </Center>
        </Center>

        <HStack textAlign="center">
          <Stack spacing={0}>
            <Text>Following</Text>
            <Text fontSize="lg" fontWeight="bold">
              {user.following.length}
            </Text>
          </Stack>
          <Stack spacing={0}>
            <Text>Followers</Text>
            <Text fontSize="lg" fontWeight="bold">
              {user.followers.length}
            </Text>
          </Stack>
          <Stack spacing={0}>
            <Text>Favorites</Text>
            <Text fontSize="lg" fontWeight="bold">
              {user.likedQuizzes.length}
            </Text>
          </Stack>
        </HStack>

        {authUser?.isAuth && (
          <Button onClick={() => followUser(user.id)}>
            {user.followers.includes(authUser.id) ? "Unfollow" : "Follow"}
          </Button>
        )}
        {authUser?.followers.includes(user.id) ? "Follows You" : ""}
      </Center>

      <TableContainer whiteSpace="normal">
        <Divider mt="10" />
        <Table size="sm" variant="simple">
          <TableCaption fontSize="md" placement="top">
            User Quizzes ({user.quizzes.length})
          </TableCaption>

          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Category</Th>
              <Th>Likes</Th>
            </Tr>
          </Thead>
          <Tbody>
            {user.quizzes.map(
              ({ title, image, category, id, status, likes, slug }) => (
                <Tr key={id}>
                  <Td title={title} minW="200px">
                    <Link as={RLink} to={`/${slug}`}>
                      <HStack>
                        <Image
                          src={image ?? PlaceholderImage}
                          width="45px"
                          height="45px"
                          objectFit="cover"
                          borderRadius={5}
                          alt=""
                        />
                        <Text fontWeight="bold">{title}</Text>
                      </HStack>
                    </Link>
                  </Td>
                  <Td>
                    <Badge>{category.toUpperCase()}</Badge>
                  </Td>
                  <Td isNumeric>{likes}</Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  ) : (
    <Navigate to="/" />
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
