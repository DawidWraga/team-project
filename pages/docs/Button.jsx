export default function Button(props) {
	const { variant } = props;

	const variants = {
		primary: 'rounded-sm bg-red-500 dark:',
		secondary: 'rounded-lg bg-slate-300',
	};

	const activeStyles = variants[variant];

	return <button className={`p-1 mx-1 ${activeStyles}`}> press me</button>;
}
