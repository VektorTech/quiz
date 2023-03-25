import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Center,
  Button,
  HStack,
  Text,
  Divider,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { EditIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import GoogleIcon from "@/components/Icons/GoogleIcon";
import { closeModal, selectModalState } from "@/features/ui/uiSlice";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { useRopcLoginMutation } from "@/services/api";
import { SERVER_ADDRESS } from "@/utils/constants";

export default function AuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      username: "johnbrown@gmail.com",
      password: "Password123",
    },
  });
  const [ropcLogin] = useRopcLoginMutation();
  const modalState = useAppSelector(selectModalState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={modalState === "LOGIN"}
      onClose={() => dispatch(closeModal())}
    >
      <ModalOverlay />
      <ModalContent maxW="18rem">
        <ModalHeader>Login</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center>
            <Button
              width="100%"
              onClick={() => {
                window.location.href = `${SERVER_ADDRESS}/api/auth/login/google`;
              }}
              leftIcon={<GoogleIcon />}
            >
              Continue with Google
            </Button>
          </Center>

          <HStack my="3">
            <Divider />
            <Text style={{ fontVariant: "small-caps" }} pl="1" pr="1">
              or
            </Text>
            <Divider />
          </HStack>

          <form
            onSubmit={handleSubmit(async (data) => {
              try {
                await ropcLogin(data).unwrap();
                navigate("/me");
              } catch (e) {}
            })}
          >
            <Stack gap="1">
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<EmailIcon color="gray.300" />}
                  />
                  <Input
                    type="email"
                    {...register("username", {
                      required: "Email is required!",
                      pattern: {
                        value: emailPattern,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.username && errors.username.message?.toString()}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<LockIcon color="gray.300" />}
                  />
                  <Input
                    type="password"
                    {...register("password", {
                      required: true,
                      minLength: {
                        value: 7,
                        message: "Must be at least 7 characters",
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.password && errors.password.message?.toString()}
                </FormErrorMessage>
              </FormControl>

              <Button isLoading={isSubmitting} width="100%" type="submit">
                Log In
              </Button>

              <Button
                variant="ghost"
                leftIcon={<EditIcon />}
                fontSize="sm"
                color="gray.600"
                type="button"
                onClick={() => {
                  window.location.href = `${SERVER_ADDRESS}/api/auth/login`;
                }}
              >
                Create An Account
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const emailPattern =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
