import { HStack, Stack, Text } from "@chakra-ui/react";

import { UserType } from "@/services/api";

export default function FollowsLikes({ user }: { user: UserType }) {
  return (
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
  );
}
