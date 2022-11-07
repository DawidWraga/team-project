//import { Box, Button, Input, FormLabel, FormControl } from '@chakra-ui/react';
// import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { HiPlus as Plus } from 'react-icons/hi';
import topics from 'db/topics';

import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Select,
	Switch,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Textarea,
	useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { getCurrentUser } from 'controllers/auth';
import { useRouter } from 'next/router';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { useGlobalContext } from 'contexts/GlobalContext';

function PostForm() {
	const router = useRouter();
	const { register, handleSubmit } = useForm();
	const onSubmit = async (data) => {
		try {
			const newData = {
				...data,
				name: getCurrentUser().name,
			};
			const res = await axios.post('/api/addForumPost', newData);
			toast.success('Post Created');
			await setTimeoutPromise(1000);
			router.push('/forums/' + res.data);
			props.onClose();
		} catch (e) {
			console.error(e);
		}
	};
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormControl isRequired>
				<FormLabel>Title</FormLabel>
				<Input
					focusBorderColor="brand.500"
					errorBorderColor="red.500"
					{...register('title')}
				/>
			</FormControl>
			<FormLabel>Description</FormLabel>
			<Textarea focusBorderColor="brand.500" {...register('desc')} />
			<FormLabel>Attach a file</FormLabel>
			<Input focusBorderColor="brand.500" {...register('file')} type={'file'} />
			<FormControl isRequired>
				<FormLabel>Topic</FormLabel>
				<Select
					focusBorderColor="brand.500"
					errorBorderColor="red.500"
					placeholder="Choose topic"
					{...register('topicId')}
				>
					{topics.map((topic) => (
						<option value={topic.id} key={topic.id}>
							{topic.title}
						</option>
					))}
				</Select>
			</FormControl>
			<FormLabel>Make as announcement</FormLabel>
			<Switch
				colorScheme={'brand'}
				value="announcement"
				{...register('accouncement')}
			/>
			<Flex padding={'2'}>
				<Button width={'full'} type="submit" colorScheme={'brand'}>
					Post
				</Button>
			</Flex>
		</form>
	);
}

function TopicForm(props) {
	const router = useRouter();
	const { setActivePage } = useGlobalContext();
	const { register, handleSubmit } = useForm();
	const onSubmit = async (data) => {
		try {
			const newData = {
				...data,
			};
			const res = await axios.post('/api/addTopic', newData);
			const redirectRoute = '/forums?topicId=' + res.data;
			toast.success('Topic created');
			router.push(redirectRoute);
			await setTimeoutPromise(1000);

			setActivePage((page) => {
				if (page.parentLink.route !== '/forums') return page;

				const updatedPage = {
					...page,
					sideNavLinks: [
						...page.sideNavLinks,
						{ label: data.title, route: redirectRoute },
					],
				};

				return updatedPage;
			});
			props.onClose();
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormControl isRequired>
				<FormLabel>Title</FormLabel>
				<Input
					focusBorderColor="brand.500"
					errorBorderColor="red.500"
					{...register('title')}
				/>
			</FormControl>
			<Flex padding={'2'}>
				<Button width={'full'} type="submit" colorScheme={'brand'}>
					Add
				</Button>
			</Flex>
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
				bottom={{ base: '20', lg: '10' }}
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
					<ModalHeader roundedBottom={'4'} bg={'brand.500'} textColor={'white'}>
						Create Post
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Tabs colorScheme={'brand'} paddingBottom={'2'}>
							<TabList>
								<Tab>Add Post</Tab>
								<Tab>Add Topic</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>
									<PostForm onClose={onClose} />
								</TabPanel>
								<TabPanel>
									<TopicForm onClose={onClose} />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
