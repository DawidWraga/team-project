import { Button } from '@chakra-ui/react';
import { signOut } from 'controllers/auth';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export const SignOutBtn = () => {
	const router = useRouter();

	return (
		<Button
			size="xs"
			variant="ghost"
			onClick={() => {
				signOut();
				router.replace('/auth');
			}}
		>
			sign out
		</Button>
	);
};
