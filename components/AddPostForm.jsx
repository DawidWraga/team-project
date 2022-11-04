//import { Box, Button, Input, FormLabel, FormControl } from '@chakra-ui/react';
// import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { HiPlus as Plus } from 'react-icons/hi';

import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function Form() {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/api/addForumPost', data);
      toast.success(JSON.stringify(res.data));
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired>
        <FormLabel>Title</FormLabel>
      </FormControl>
      <Input errorBorderColor="red.500" {...register('title')} />
      <FormLabel>Description</FormLabel>
      <Input {...register('desc')} />
      <FormLabel>Attach a file</FormLabel>
      <Input {...register('file')} type={'file'} />
      <FormControl isRequired>
        <FormLabel>Topic</FormLabel>
        <Select
          errorBorderColor="red.500"
          placeholder="Choose topic"
          {...register('topic')}
        >
          <option>Printing</option>
          <option>Death beams</option>
          <option>Stolen lunch</option>
        </Select>
      </FormControl>
      <FormLabel>Make as announcement</FormLabel>
      <Checkbox value="announcement" {...register('accouncement')} />
      <Button type="submit" colorScheme={'brand'}>
        Post
      </Button>
    </form>
  );
}

export function AddPostForm() {
  const { isOpen, onOpen, onClose, onPost } = useDisclosure();

  // const { register, handleSubmit } = useForm();
  // const onSubmit = (data) => toast.success(JSON.stringify(data));

  // return (
  //   <Box>
  //     <form onSubmit={handleSubmit(onSubmit)}>
  //       <FormControl isRequired>
  //         <FormLabel>First name</FormLabel>
  //       </FormControl>
  //       <Input {...register('firstName')} />
  //       <FormLabel>Last name</FormLabel>
  //       <Input {...register('lastName')} />
  //       <Button type="submit">Submit</Button>
  //     </form>
  //   </Box>
  // );
  return (
    <>
      <IconButton
        onClick={onOpen}
        colorScheme={'brand'}
        icon={<Plus />}
        position={'fixed'}
        bottom={'10'}
        right={'10'}
        rounded={'full'}
        size={'lg'}
      />
      <Modal
        size={'xl'}
        motionPreset="slideInBottom"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
