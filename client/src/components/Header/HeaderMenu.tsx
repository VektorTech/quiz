import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link as RLink } from "react-router-dom";

import { CATEGORIES } from "@/utils/constants";

const HeaderMenu = () => {
  const firstThird = Math.ceil(CATEGORIES.length / 3);
  const secondThird = Math.ceil((CATEGORIES.length / 3) * 2);
  const columns = [
    CATEGORIES.slice(0, firstThird),
    CATEGORIES.slice(firstThird, secondThird),
    CATEGORIES.slice(secondThird),
  ];

  return (
    <Menu>
      <MenuButton
        display={{ base: "none", md: "inline-flex" }}
        variant="outline"
        aria-label="list categories"
        as={IconButton}
        icon={<HamburgerIcon />}
      />
      <MenuList minW={"auto"} maxW="100vw">
        <Flex columnGap="2">
          {columns.map((column, i) => (
            <Box key={"menu:" + i} width={"33.333%"}>
              {column.map((category) => (
                <MenuItem
                  key={"menu:" + category}
                  textTransform="capitalize"
                  as={RLink}
                  to={`browse/${category}`}
                >
                  {category}
                </MenuItem>
              ))}
            </Box>
          ))}
        </Flex>
      </MenuList>
    </Menu>
  );
};

export default HeaderMenu;
