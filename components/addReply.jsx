import { Box, Button, Input, FormLabel, FormControl, Flex, Textarea } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getCurrentUser } from '/controllers/auth';
import { comments } from 'db/postComments';
import axios from 'axios';
import { useRouter } from 'next/router';

export function AddReply() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const {id} = router.query;
  const onSubmit = async (data) => {
    try{
      const newData={name: getCurrentUser().name,
      ...data, postId: id
      
      }
      console.log(newData)
      const res = await axios.post('/api/addReply', newData);
      toast.success(JSON.stringify(res.data))
      console.log(res)
    } catch (e) {
      console.error(e)
    }
  };

  return (
    <Flex width={'100%'} overflow='hidden' padding='1' flexDirection={'column'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isRequired>
          <FormLabel>Comment as: <i>{getCurrentUser().name}</i></FormLabel>
        </FormControl>
        <Box position={'relative'}>
        <Textarea w='100%' h='100%' rounded={'md'} size='sm' placeholder='What are your thoughts?' {...register('desc')} />
        <Flex padding='1' justifyContent={'flex-end'}>
          <Button zIndex={1000} position={'absolute'} bottom='3' right='1' size='sm' type="submit">Submit</Button>
        </Flex>
        </Box>
      </form>
    </Flex>
  );
}
