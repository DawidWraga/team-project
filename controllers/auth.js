export const executeSignIn = async (email, role) => {
	localStorage.setItem('user', JSON.stringify({ email, role }));
};

export const getCurrentUser = () => {
	return JSON.parse(localStorage.getItem('user')) || false;
};

export const signOut = () => {
	return localStorage.removeItem('user');
};
