// JS CEX
// must return JSX
// Capitalize
// EX Export

import Button from './Button';


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async (ctx) => {
	const { data } = await fetch('some url') // your fetch function here 

	return {
		props: {
			data
		}
	}
}

export default function DocsPage(props) {
	const {data} = props;

	return (
		<div>
			this is the docs page
			<Button variant="primary" />
			<Button variant="secondary" />
		</div>
	);
}
