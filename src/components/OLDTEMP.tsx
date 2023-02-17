import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { MdCheck } from 'react-icons/md';
import axios from 'axios';

export default function InviteTeamModal(props) {
  const { isOpen, onClose } = props;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite Team</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function Form() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [isServerSuccess, setIsServerSuccess] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/inviteTeam', data);
      setIsServerSuccess(true);
      toast.success(`${data.email} has been invited!`);
      reset();
    } catch (e) {
      const errors = e.response?.data;
      // console.log(errors.type);

      // if (errors.type === 'email') {
      // setError(errors?.type, {
      // 	type: 'server',
      // });

      toast.error('User already exists', { position: 'top-center' });
      reset();
    }
  };

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      py="10px"
      pb="20px"
      flexDir="column"
      gap="5"
    >
      <FormControl isRequired isInvalid={!!errors.email}>
        <Input
          type="email"
          placeholder="johnsmith@make-it-all.co.uk"
          required
          minLength={6}
          {...register('email', {
            required: true,
            validate: (email) => email.includes('@make-it-all.co.uk'),
          })}
        />
        {errors.email?.type === 'validate' && (
          <FormErrorMessage>
            Only internal emails allowed ie @make-it-all.co.uk
          </FormErrorMessage>
        )}
        {errors.email?.type === 'server' && (
          <FormErrorMessage>User already has an account</FormErrorMessage>
        )}
      </FormControl>
      <Button
        type="submit"
        colorScheme={'brand'}
        variant="solid"
        isLoading={isSubmitting}
        loadingText="Submitting"
        leftIcon={isServerSuccess && <MdCheck fontSize="1.5rem" />}
      >
        Send Invite
      </Button>
    </Flex>
  );
}
