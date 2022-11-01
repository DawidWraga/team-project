import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Heading,
	Input,
	Box,
	Link as StyledLink,
	InputGroup,
	InputRightAddon,
} from '@chakra-ui/react';
import { getCurrentUser } from '/controllers/auth';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { MdCheck } from 'react-icons/md';
import Link from 'next/link';

export default function RegisterPage(props) {
	const {} = props;
	const router = useRouter();

	useEffect(() => {
		// if (!isBrowser()) return;
		const user = getCurrentUser();
		if (user) router.replace('/');
	}, []);

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitSuccessful, isSubmitting },
	} = useForm();

	const [isServerSuccess, setIsServerSuccess] = useState(false);

	const onSubmit = async (data) => {
		try {
			console.log(data);

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
		<div
			className="bg-pale-main w-screen h-screen grid place-content-center"
			onClick={() => console.log(errors.confirmPassword?.type)}
		>
			<Box
				as="main"
				className="bg-white w-screen max-w-[450px]  justify-center rounded-lg shadow-xl "
				minH={{ base: '100vh', sm: '500px' }}
				py={3}
			>
				<Box
					as="form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col justify-center items-center w-full child:my-2 child:w-full "
					px={{ base: 3, sm: 6, lg: 8 }}
					id="login-form"
				>
					<Heading
						size={{ base: 'md', md: 'lg' }}
						wordBreak="revert"
						break
						mx="auto"
						textAlign={'center'}
						fontWeight="semibold"
					>
						Make-it-all Portal
					</Heading>

					<FormControl isRequired isInvalid={errors.fullName}>
						<FormLabel>Full name</FormLabel>
						<Input
							type="text"
							placeholder="John smith"
							required
							minLength={6}
							{...register('fullName', {
								required: true,
							})}
						/>
						{errors.fullName?.type === 'server' && (
							<FormErrorMessage>
								Only one account is allowed per user
							</FormErrorMessage>
						)}
					</FormControl>

					<FormControl isRequired isInvalid={errors.email}>
						<FormLabel>Email</FormLabel>

						<Input
							type="email"
							placeholder="johnsmith@client.com"
							className="input-outline mt-px "
							required
							{...register('email', {
								required: true,
								validate: (email) => email.includes('@client.com'),
							})}
						/>
						{errors.email?.type === 'validate' && (
							<FormErrorMessage>
								Only internal emails are allowed
							</FormErrorMessage>
						)}
						{errors.email?.type === 'server' && (
							<FormErrorMessage>
								Only one account is allowed per user
							</FormErrorMessage>
						)}
					</FormControl>
					<FormControl
						isRequired
						isInvalid={errors.password?.type === 'pattern'}
					>
						<FormLabel>Password</FormLabel>
						<Input
							type="password"
							placeholder="**********"
							className="input-outline"
							required
							{...register('password', {
								required: true,
								pattern:
									/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/,
							})}
						/>
						{errors.password?.type === 'pattern' && (
							<FormErrorMessage>
								Minimum eight characters, at least one uppercase letter, one
								lowercase letter, one number and one special character,
							</FormErrorMessage>
						)}
					</FormControl>

					<FormControl isRequired isInvalid={errors.confirmPassword}>
						<FormLabel>Confirm Password</FormLabel>
						<Input
							type="password"
							placeholder="**********"
							className="input-outline"
							required
							{...register('confirmPassword', {
								required: true,
								pattern:
									/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/,
							})}
						/>
						{errors?.confirmPassword?.type === 'unmatchingPasswords' && (
							<FormErrorMessage>Passwords are not matching!</FormErrorMessage>
						)}
						{errors.confirmPassword?.type === 'pattern' && (
							<FormErrorMessage>
								Minimum eight characters, at least one uppercase letter, one
								lowercase letter, one number and one special character,
							</FormErrorMessage>
						)}
					</FormControl>

					{/* <FormControl isRequired>
						<FormLabel>Select username</FormLabel>
						<InputGroup>
							<Input
								type="text"
								placeholder="john.smith"
								required
								minLength={4}
								maxLength={15}
								{...register('username', {
									required: true,
								})}
							/>
							<InputRightAddon children="@client.com" />
						</InputGroup>
					</FormControl> */}

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
				</Box>
			</Box>
		</div>
	);
}
