export const executeSignIn = async (user) => {
	localStorage.setItem('user', JSON.stringify(user));
};

export const getCurrentUser = () => {
	return JSON.parse(localStorage.getItem('user')) || false;
};

export const signOut = () => {
	return localStorage.removeItem('user');
};
