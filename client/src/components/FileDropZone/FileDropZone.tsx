import { useRef, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Image,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";
import prettyBytes from "pretty-bytes";

import { DeleteIcon } from "@chakra-ui/icons";
import CloudUploadIcon from "@/components/Icons/CloudUploadIcon";

export default function FileDropZone({
  inputProps,
}: {
  inputProps: UseFormRegisterReturn;
}) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);

  return (
    <FormControl>
      <FormLabel cursor="pointer">Upload Image</FormLabel>

      {imgFile && (
        <IconButton
          icon={<DeleteIcon />}
          position="absolute"
          zIndex="1"
          variant="outline"
          colorScheme="red"
          mt="2"
          ml="2"
          onClick={(e) => {
            e.stopPropagation();
            if (fileInput.current?.files) {
              fileInput.current.value = "";
              fileInput.current.files = null;
              inputProps.onChange({ target: fileInput.current });
              setImgFile(null);
            }
          }}
          aria-label="remove image"
        />
      )}

      <Button
        as="div"
        role="button"
        overflow="hidden"
        variant="ghost"
        display="flex"
        justifyContent="center"
        gap="3"
        width="100%"
        border="2px dashed"
        borderColor="gray.600"
        tabIndex={0}
        _focusVisible={{
          borderColor: "brand.400",
          color: "brand.400",
        }}
        onClick={() => fileInput.current?.click()}
        sx={{
          "&.drag-hover": {
            background: "brand.100",
            cursor: "pointer",
          },
        }}
        onDragEnter={(e) => {
          if (e.target instanceof HTMLElement)
            e.target.classList.add("drag-hover");
        }}
        onDragLeave={(e) => {
          if (e.target instanceof HTMLElement)
            e.target.classList.remove("drag-hover");
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();

          if (e.target instanceof HTMLElement)
            e.target.classList.remove("drag-hover");

          if (fileInput.current && e.dataTransfer.files.length) {
            fileInput.current.files = e.dataTransfer.files;
            inputProps.onChange({ target: fileInput.current });
            setImgFile(fileInput.current.files[0]);
          }
        }}
        height="140px"
      >
        {imgFile ? (
          <Image
            m="0"
            width="120px"
            height="120px"
            objectFit="contain"
            pointerEvents="none"
            src={URL.createObjectURL(imgFile)}
            alt=""
          />
        ) : (
          <CloudUploadIcon pointerEvents="none" boxSize="10" />
        )}

        {imgFile ? (
          <VStack
            overflow="hidden"
            pointerEvents="none"
            alignItems="start"
            textAlign="left"
          >
            <Text
              pt="2"
              as="span"
              display="block"
              width="36ch"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              margin="auto"
            >
              {imgFile.name}
            </Text>
            <Text as="span" display="block" fontSize="xs" color="gray.500">
              {prettyBytes(imgFile.size)}
            </Text>
          </VStack>
        ) : (
          <Text as="span" pointerEvents="none">
            <strong>Choose an image</strong><wbr/> or drag it here.
          </Text>
        )}
      </Button>
      <Input
        type="file"
        hidden
        accept="image/*"
        placeholder="Upload Preview Image"
        {...inputProps}
        onChange={(e) => {
          if (e.target.files?.length) {
            inputProps.onChange(e);
            setImgFile(e.target.files[0]);
          }
        }}
        ref={(inputElement) => {
          inputProps.ref(inputElement);
          fileInput.current = inputElement;
        }}
      />
    </FormControl>
  );
}
