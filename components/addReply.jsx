import { Box, Button, Input, FormLabel, FormControl, Flex, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getCurrentUser } from '/controllers/auth';
import { comments } from 'db/postComments';
import { axios } from 'axios';

export function AddReply() {
  const { register, handleSubmit } = useForm();
  const user = getCurrentUser();

  const onSubmit = async (data) => {
    try{
      const newData={
      ...data,
      name:getCurrentUser().name
      }
      const res = await axios.post('/api/addReply', newData);
      toast.success(user.name+JSON.stringify(data))
      console.log(comments)
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <Flex width={'100%'} overflow='hidden' padding='1' flexDirection={'column'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isRequired>
          <FormLabel>Comment as: <i>{user.name}</i></FormLabel>
        </FormControl>
        <Textarea rounded={'md'} size='sm' placeholder='What are your thoughts?' {...register('message')} />
        <Box padding='1'>
          <Button type="submit">Submit</Button>
        </Box>
      </form>
    </Flex>
  );
}
