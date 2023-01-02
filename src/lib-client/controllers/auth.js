export const executeSignIn = async (user) => {
	typeof window !== 'undefined' &&
		localStorage.setItem('user', JSON.stringify(user));
};

export const getCurrentUser = () => {
	return (
		(typeof window !== 'undefined' &&
			JSON.parse(localStorage.getItem('user'))) ||
		false
	);
};

export const signOut = () => {
	return typeof window !== 'undefined' && localStorage.removeItem('user');
};
