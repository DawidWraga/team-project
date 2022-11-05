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
	} = useForm();

	const [isServerSuccess, setIsServerSuccess] = useState(false);

	const onSubmit = async (data) => {
		try {
			if (data.password !== data.confirmPassword) {
				console.log(data);
				return setError('confirmPassword', { type: 'unmatchingPasswords' });
			}

			const res = await axios.post('/api/register', data);
			setIsServerSuccess(true);
			await setTimeoutPromise(1500);
			router.push('/auth');
		} catch (e) {
			const errors = e.response.data;
			console.log(errors.type);

			// if (errors.type === 'email') {
			setError(errors.type, {
				type: 'server',
			});
			// }
			// if (errors.password) {
			//   setError('password', {
			//     type: "server",
			//     message: 'Something went wrong with password',
			//   });
			// }

			toast.error('Unable to create new user', { position: 'top-center' });
		}
	};

	return (
		<Flex as="form" onSubmit={handleSubmit(onSubmit)} py="15px" pb="50px">
			<FormControl isRequired isInvalid={errors.fullName}>
				<Input
					type="text"
					placeholder="johnsmith@make-it-all.com"
					required
					minLength={6}
					{...register('email', {
						required: true,
					})}
				/>
				{errors.fullName?.type === 'server' && (
					<FormErrorMessage>
						Only one account is allowed per user
					</FormErrorMessage>
				)}
			</FormControl>
			<Button
				type="submit"
				colorScheme={isServerSuccess ? 'green' : 'brand'}
				variant="solid"
				isLoading={isSubmitting}
				loadingText="Submitting"
				leftIcon={isServerSuccess && <MdCheck fontSize="1.5rem" />}
			>
				{isServerSuccess ? 'User created!' : 'Register'}
			</Button>
		</Flex>
	);
}
