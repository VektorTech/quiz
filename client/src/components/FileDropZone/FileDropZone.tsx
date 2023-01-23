import { useRef, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { UseFormRegisterReturn } from "react-hook-form";
import prettyBytes from "pretty-bytes";

import cloudUploadImage from "@/assets/images/cloud-upload.png";

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
      <Button
        as="div"
        role="button"
        overflow="hidden"
        display="flex"
        justifyContent="center"
        gap="5"
        width="100%"
        border="2px dashed"
        borderColor="gray.600"
        tabIndex={0}
        onClick={() => fileInput.current?.click()}
        sx={{
          "&.drag-hover": {
            background: "brand.100",
            cursor: "pointer",
          },
        }}
        onDragEnter={(e) => {
          if (e.target instanceof HTMLButtonElement)
            e.target.classList.add("drag-hover");
        }}
        onDragLeave={(e) => {
          if (e.target instanceof HTMLButtonElement)
            e.target.classList.remove("drag-hover");
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();

          if (e.target instanceof HTMLButtonElement)
            e.target.classList.remove("drag-hover");

          if (fileInput.current && e.dataTransfer.files.length) {
            fileInput.current.files = e.dataTransfer.files;
            inputProps.onChange({ target: fileInput.current });
            setImgFile(fileInput.current.files[0]);
          }
        }}
        height="140px"
      >
        <VStack spacing="0">
          <Image
            m="0"
            width="100px"
            height="100px"
            objectFit="contain"
            src={imgFile ? URL.createObjectURL(imgFile) : cloudUploadImage}
            pointerEvents="none"
            alt=""
          />
          {imgFile && (
            <Text
              onClick={(e) => {
                e.stopPropagation();
                if (fileInput.current?.files) {
                  fileInput.current.value = "";
                  fileInput.current.files = null;
                  inputProps.onChange({ target: fileInput.current });
                  setImgFile(null);
                }
              }}
              tabIndex={0}
              as="span"
              display="block"
              fontSize="sm"
              textDecor="underline"
              aria-label="remove image"
              role="button"
              mt="0"
            >
              {`(Remove)`}
            </Text>
          )}
        </VStack>

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
              color="brand.500"
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
            <strong>Choose an image</strong> or drag it here.
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
