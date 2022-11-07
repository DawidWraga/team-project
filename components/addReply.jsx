import {
	Box,
	Button,
	Input,
	FormLabel,
	FormControl,
	Flex,
	Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getCurrentUser } from '/controllers/auth';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export function AddReply(props) {
	const { register, handleSubmit } = useForm();
	const router = useRouter();
	const { id } = router.query;
	const onSubmit = async (data) => {
		try {
			const newData = { name: getCurrentUser().fullName, ...data, postId: id };
			const res = await axios.post('/api/addReply', newData);
			toast.success('reply has been posted');
			props.setReplyActive(false);
			router.replace(router.asPath);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<Flex
			as={motion.div}
			initial={{ height: 0 }}
			animate={{ height: '150px' }}
			exit={{ height: 0 }}
			width={'100%'}
			overflow="hidden"
			// padding="1"
			flexDirection={'column'}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<FormControl isRequired>
					<FormLabel>
						Comment as: <i>{getCurrentUser().fullName ?? 'John Smith'}</i>
					</FormLabel>
				</FormControl>
				<Box position={'relative'}>
					<Textarea
						w="100%"
						h="100%"
						rounded={'md'}
						size="sm"
						placeholder="What are your thoughts?"
						{...register('desc')}
					/>
					<Flex justifyContent={'flex-end'}>
						<Button
							zIndex={1000}
							position={'absolute'}
							bottom="3"
							right="1"
							size="sm"
							type="submit"
						>
							Submit
						</Button>
					</Flex>
				</Box>
			</form>
		</Flex>
	);
}
