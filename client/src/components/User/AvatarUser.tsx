import { AtSignIcon } from "@chakra-ui/icons";
import { Avatar, Heading, Stack } from "@chakra-ui/react";

import VerifiedIcon from "../Icons/VerifiedIcon";
import { UserType } from "@/services/api";

export default function AvatarUser({ user }: { user: UserType }) {
  return (
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
  );
}
