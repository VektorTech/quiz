import { SVGAttributes } from "react";
import { Icon } from "@chakra-ui/react";

const MoreVerticalIcon: CustomIcon = ({ fillColor, ...props }) => {
  return (
    <Icon {...props}>
      <line x1="12" y1="5.95" x2="12" y2="6.05" style={lineStyles}></line>
      <line x1="12" y1="11.95" x2="12" y2="12.05" style={lineStyles}></line>
      <line x1="12" y1="17.95" x2="12" y2="18.05" style={lineStyles}></line>
    </Icon>
  );
};

const lineStyles: SVGAttributes<SVGLineElement>["style"] = {
  fill: "currentColor",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2.5,
};

export default MoreVerticalIcon;
