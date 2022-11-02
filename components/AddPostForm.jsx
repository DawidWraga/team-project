import { Box, Button, Input, FormLabel, FormControl } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export function AddPostForm() {
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => toast.success(JSON.stringify(data));

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isRequired>
          <FormLabel>First name</FormLabel>
        </FormControl>
        <Input {...register('firstName')} />
        <FormLabel>Last name</FormLabel>
        <Input {...register('lastName')} />
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  );
}
