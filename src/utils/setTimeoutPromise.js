export const setTimeoutPromise = (timeout) => {
	return new Promise((resolve) => setTimeout(resolve, timeout));
};
