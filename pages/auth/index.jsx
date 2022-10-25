import axios from 'axios';
import { executeSignIn } from '/controllers/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function AuthPage(props) {
	const {} = props;

	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState,
		formState: { errors, isSubmitSuccessful },
	} = useForm();

	const [isServerSuccessful, setIsServerSuccessful] = useState(false);

	const onSubmit = async (data) => {
		setIsServerSuccessful(false);

		toast.promise(
			axios.post('/api/auth', data),
			{
				pending: 'Validating credentials...',
				success: {
					render(res) {
						setIsServerSuccessful(true);
						executeSignIn(res.data.data.email, res.data.data.role);
						router.replace('/');

						return `Sign in successful `;
					},
				},
				error: 'Sign in failed',
			}
			// { hideProgressBar: true }
		);
	};

	// ======================= SIGN IN ERROR HANDLER ===================
	const onSubmitError = () => {
		if (errors.email?.type === 'validate') {
			toast.error('Only internal emails are allowed');
		}

		if (errors.password?.type === 'pattern') {
			toast.error(
				'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
				{ autoClose: 5000 }
			);
		}
	};

	return (
		<div className="bg-pale-main w-screen h-screen grid place-content-center">
			<main className="bg-white w-[clamp(320px,75vw,500px)] h-[600px] rounded-lg shadow-xl ">
				<form
					onSubmit={handleSubmit(onSubmit, onSubmitError)}
					className="flex flex-col justify-center items-center w-full child:my-5 child:w-full px-12"
					id="login-form"
				>
					<h1
						className="text-4xl text-pale-contrast"
						onClick={() => toast.success('success')}
					>
						Login
					</h1>
					<label className="text-pale-contrast">
						Email
						<input
							type="email"
							placeholder="johnsmith@client.com"
							className="input-outline mt-px "
							required
							{...register('email', {
								required: true,
								validate: (email) => email.includes('@client.com'),
							})}
						/>
					</label>
					<label className="text-pale-contrast">
						Password
						<input
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
					</label>
					<button className="btn-outline hover:btn-full" type="submit">
						Login
					</button>
				</form>
			</main>
		</div>
	);
}
