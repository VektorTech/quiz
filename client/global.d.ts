import { IconProps, ComponentWithAs } from "@chakra-ui/react";

export declare global {
  interface CustomIconProps extends IconProps {
    fillColor?: string;
  }

  type CustomIcon = ComponentWithAs<"svg", CustomIconProps>;
}
