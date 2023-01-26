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
  Badge,
  Image,
  HStack,
  Divider,
  Center,
  Button,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { TimeIcon } from "@chakra-ui/icons";

import {
  useFollowUserMutation,
  useGetAuthUserQuery,
  useGetUserByIdQuery,
} from "@/services/api";
import { Link as RLink, Navigate, useParams } from "react-router-dom";
import { getDateFormatted } from "@/utils/i18n";
import PlaceholderImage from "@/assets/images/quiz-img-placeholder.jpg";
import LocationIcon from "@/components/Icons/LocationIcon";
import { AvatarUser, FollowsLikes } from "@/components/User";

export default function User() {
  const params = useParams();
  const { data: authUser } = useGetAuthUserQuery();
  const { data, isLoading } = useGetUserByIdQuery(params.userID || "");
  const user = data?.data;

  const [followUser] = useFollowUserMutation();

  if (isLoading) return <Container textAlign="center">Loading...</Container>;

  return user ? (
    <Container maxW="container.lg">
      <Helmet>
        <title>User | {user.avatar.username}</title>
      </Helmet>
      <Center flexDirection="column" gap="5" pt="10">
        <AvatarUser user={user} />

        <Text>{user.avatar.bio ?? "No bio yet"}</Text>

        <Center gap="2">
          <Center fontSize="sm">
            <LocationIcon boxSize={5} />
            {user.country_abbr ?? "unknown"}
          </Center>
          <Center fontSize="sm">
            <TimeIcon boxSize={4} mr="1" /> Joined{" "}
            {getDateFormatted(user.createdAt, "standard")}
          </Center>
        </Center>

        <FollowsLikes user={user} />

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
                          src={image || PlaceholderImage}
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
                  <Td>{likes}</Td>
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
