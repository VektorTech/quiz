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
  UserType,
  useUpdateQuizMutation,
} from "@/services/api";
import { Link as RLink } from "react-router-dom";
import PlaceholderImage from "@/assets/images/quiz-img-placeholder.jpg";
import MoreVerticalIcon from "@/components/Icons/MoreVerticalIcon";
import { DeleteIcon, EditIcon, TimeIcon } from "@chakra-ui/icons";
import LocationIcon from "@/components/Icons/LocationIcon";
import PublishIcon from "@/components/Icons/PublishIcon";
import { Helmet } from "react-helmet-async";
import { getDateFormatted } from "@/utils/i18n";
import { AvatarUser, FollowsLikes } from "@/components/User";

export default function Profile({ user }: { user: UserType }) {
  const [updateQuiz] = useUpdateQuizMutation();
  const [deleteQuiz] = useDeleteQuizMutation();

  return (
    <Container maxW="container.lg">
      <Helmet>
        <title>{user.avatar.username}</title>
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
      </Center>

      <TableContainer whiteSpace="normal">
        <Divider mt="10" />
        <Table size="sm" variant="simple">
          <TableCaption fontSize="md" placement="top">
            Your Quizzes ({user.quizzes.length})
          </TableCaption>

          <Thead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>Title</Th>
              <Th></Th>
              <Th>Status</Th>
              <Th>Category</Th>
              <Th>Likes</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {user.quizzes.map(
              ({ title, image, category, id, status, likes, slug }) => (
                <Tr key={id}>
                  <Td>
                    <Checkbox />
                  </Td>
                  <Td title={title} minW="150px">
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
                    <Link
                      whiteSpace="nowrap"
                      as={RLink}
                      to={`/dashboard/${id}`}
                    >
                      📈 View Stats
                    </Link>
                  </Td>
                  <Td>
                    <Badge colorScheme={BadgeColor[status]}>{status}</Badge>
                  </Td>
                  <Td>
                    <Badge>{category.toUpperCase()}</Badge>
                  </Td>
                  <Td>{likes}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVerticalIcon boxSize={5} />}
                        aria-label="more actions"
                      />
                      <MenuList>
                        <MenuItem
                          as={RLink}
                          to={`/edit/${id}`}
                          icon={<EditIcon boxSize={4} />}
                        >
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
  );
}

export const BadgeColor = Object.freeze({
  DRAFTED: "gray",
  ACTIVE: "green",
  CLOSED: "red",
});
