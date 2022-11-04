import { Box, Button, Input, FormLabel, FormControl, Flex } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export function AddReply() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => toast.success(JSON.stringify(data));

  return (
    <Flex width={'100%'} overflow='hidden'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isRequired>
          <FormLabel>Description</FormLabel>
        </FormControl>
        <Input {...register('message')} />
        <Button type="submit">Submit</Button>
      </form>
    </Flex>
  );
}
