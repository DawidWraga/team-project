import { signOut } from 'controllers/auth';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export const SignOutBtn = () => {
	const router = useRouter();

	return (
		<button
			className="text-xs m-0"
			onClick={() => {
				signOut();
				toast.success('Sign out succesful');
				router.replace('/auth');
			}}
		>
			sign out
		</button>
	);
};
