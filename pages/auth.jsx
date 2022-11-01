import axios from 'axios';
import { executeSignIn } from '/controllers/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
	Button,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Box,
	Heading,
	Link as StyledLink,
	Flex,
} from '@chakra-ui/react';
import { getCurrentUser } from '/controllers/auth';
import { setTimeoutPromise } from 'utils/setTimeoutPromise';
import { MdCheck } from 'react-icons/md';
import Link from 'next/link';
import { Logo } from 'components/Logo';
import { DesktopOnly, MobileOnly } from 'components/deviceTypes';

export default function AuthPage(props) {
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
		formState: { errors, isSubmitSuccessful, isSubmitting },
	} = useForm();

	const [isServerSuccess, setIsServerSuccess] = useState(false);

	const onSubmit = async (data) => {
		try {
			const res = await axios.post('/api/auth', data);
			const userData = res.data;
			executeSignIn(userData);
			setIsServerSuccess(true);
			await setTimeoutPromise(180);
			router.push('/');
		} catch (e) {
			// console.log(e);
			toast.error('Invalid credentials', { position: 'top-center' });
		}
	};

	return (
		<Flex
			className="bg-pale-main w-screen h-screen grid"
			// placeContent={{ base: 'center', lg: 'end' }}
			w="100vw"
			h="100vh"
			justifyContent={'center'}
		>
			<Flex
				as="main"
				className="bg-white justify-center  rounded-lg shadow-xl "
				h={{ base: '100vh' }}
				w="100vw"
				maxW={{ base: '100vw', lg: '650px' }}
				alignContent="center"
				alignItems="center"
				justifyItems={'center'}
				roundedRight={{ lg: '3xl' }}
				// mr={{ lg: 'auto' }}
				// pt={{ base: '20%', sm: '10%' }}
				flexDir="column"
			>
				<DesktopOnly w="100%">
					<Heading size="lg" fontWeight={600} textAlign="center">
						Sign into Portal
					</Heading>
				</DesktopOnly>
				<MobileOnly w="100%">
					<Logo />
				</MobileOnly>
				<Flex
					as="form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col justify-center items-center w-full child:my-5 child:w-full child:max-w-[450px]"
					px={{ base: 3, sm: 6, lg: 8 }}
					id="login-form"
				>
					{/* <Heading
						size={{ base: 'xl', sm: 'lg' }}
						mx="auto"
						textAlign={'center'}
						fontWeight="semibold"
					>
						Make-it-all Portal
					</Heading> */}

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
					</FormControl>
					<FormControl isRequired isInvalid={errors.password}>
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
					<Button
						type="submit"
						colorScheme={isServerSuccess ? 'green' : 'brand'}
						variant="solid"
						isLoading={isSubmitting}
						loadingText="Submitting"
						leftIcon={isServerSuccess && <MdCheck fontSize="1.5rem" />}
					>
						{isServerSuccess ? 'Success!' : 'Login'}
					</Button>
					<Link href="register" passHref>
						<StyledLink
							textAlign="center"
							textColor={'gray.500'}
							my="0"
							fontSize="sm"
						>
							register
						</StyledLink>
					</Link>
				</Flex>
			</Flex>
			<DesktopOnly w="100%" h="100vh" display="flex" justifyContent="center">
				<Logo
					sx={{
						'& > svg': { fontSize: '7rem' },
						'& > h2': { fontSize: '4rem' },
					}}
				/>
			</DesktopOnly>
		</Flex>
	);
}
