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
	FormHelperText,
	FormLabel,
	Heading,
	Input,
} from '@chakra-ui/react';
import { getCurrentUser } from '/controllers/auth';

export default function AuthPage(props) {
	const {} = props;

	const router = useRouter();
	const user = getCurrentUser();
	if (user) router.replace('/');

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitSuccessful, isSubmitting },
	} = useForm();

	const onSubmit = async (data) => {
		try {
			const res = await axios.post('/api/auth', data);
			const userData = res.data;
			executeSignIn(userData);
			router.replace('/');
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className="bg-pale-main w-screen h-screen grid place-content-center">
			<main className="bg-white w-[clamp(320px,75vw,500px)] h-[600px] rounded-lg shadow-xl ">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col justify-center items-center w-full child:my-5 child:w-full px-12"
					id="login-form"
				>
					<Heading
						size={'lg'}
						mx="auto"
						textAlign={'center'}
						fontWeight="semibold"
					>
						Make-it-all Portal
					</Heading>
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
						colorScheme={isSubmitSuccessful ? 'green' : 'brand'}
						variant="solid"
						isLoading={isSubmitting}
					>
						Login
					</Button>
				</form>
			</main>
		</div>
	);
}
