import { ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { DragHandleIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";

import { range } from "@/utils";

const DraggableDataList = <T extends unknown>({
  data,
  renderItem,
  onDragEnd,
  keyExtractor,
}: {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onDragEnd: (newData: T[], newIndex: number) => void;
  keyExtractor: (item: T) => string;
}) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const listItemNodes = useRef<HTMLElement[]>([]);
  listItemNodes.current = [];

  useLayoutEffect(() => {
    listItemNodes.current.forEach((item) => {
      item.style.transition = "transform 0s";
      item.style.transform = "translateY(0)";
      item.style.zIndex = "0";
    });

    if (currentIndex == null) return;
    const source = listItemNodes.current[currentIndex];
    source.style.zIndex = "1";

    const rect = source.getBoundingClientRect();
    const topPos = rect.top;
    const height = rect.height;
    const indices = Array.from(range(0, listItemNodes.current.length)).filter(
      (index) => index !== currentIndex
    );

    const moveHandler = (event: MouseEvent | TouchEvent) => {
      const isMouse = event instanceof MouseEvent;
      const posY =
        (isMouse ? event.clientY : event.touches[0].clientY) -
        topPos -
        height / 2;
      const to = Math.round(posY / height) + currentIndex;

      if (to > -1 && to < listItemNodes.current.length) {
        source.style.transform = `translateY(${posY}px)`;

        const dir = Math.sign(to - currentIndex);
        indices.forEach((index) => {
          const listItem = listItemNodes.current[index];
          const idx = index - dir / 2;

          if (
            (idx > currentIndex && idx < to) ||
            (idx < currentIndex && idx > to)
          ) {
            listItem.style.transition = `transform 0.25s`;
            listItem.style.transform = `translateY(${-dir * 100}%)`;
          } else listItem.style.transform = `translateY(0%)`;
        });
      }
    };

    const mouseUpHandler = (event: MouseEvent | TouchEvent) => {
      const isMouse = event instanceof MouseEvent;
      const posY =
        (isMouse ? event.clientY : event.changedTouches[0].clientY) -
        topPos -
        height / 2;
      let to = Math.round(posY / height) + currentIndex;

      if (to !== currentIndex) {
        to = Math.min(Math.max(to, 0), data.length - 1);
        const newChoices = [...data];
        const [temp] = newChoices.splice(currentIndex, 1);
        newChoices.splice(to, 0, temp);

        setCurrentIndex(null);
        onDragEnd(newChoices, to);
      }
    };

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("touchmove", moveHandler);
    window.addEventListener("mouseup", mouseUpHandler);
    window.addEventListener("touchend", mouseUpHandler);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("touchmove", moveHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      window.removeEventListener("touchend", mouseUpHandler);
    };
  }, [currentIndex, data, onDragEnd]);

  return (
    <Box>
      {data.map((item: T, i: number) => (
        <Flex
          key={keyExtractor(item)}
          ref={(ref) => ref && (listItemNodes.current[i] = ref)}
          py="3px"
          bgColor="white"
          position="relative"
        >
          <DragHandle
            onMouseDown={() => setCurrentIndex(i)}
            onTouchStart={() => setCurrentIndex(i)}
          >
            <DragHandleIcon color="gray.400" />
          </DragHandle>
          <Box flexGrow="1">{renderItem(item, i)}</Box>
        </Flex>
      ))}
    </Box>
  );
};

const DragHandle = styled.button`
  padding-right: 5px;
  display: flex;
  align-items: center;
`;

export default DraggableDataList;
